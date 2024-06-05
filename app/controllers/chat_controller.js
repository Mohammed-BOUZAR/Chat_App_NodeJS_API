const { STATUS_CODE } = require("#enums/status_code");
const Chat = require("#models/chat");
const User = require("#models/user");
const Participant = require("#models/participant");
const { Op } = require("sequelize");

module.exports.getChats = async (req, res) => {
  let user = await User.findByPk(req.user.id);
  let chats = await user.getChats();
  for (let i = 0; i < chats.length; i++) {
    let c = await Participant.findOne({
      where: {
        chatId: chats[i].Participant.chatId,
        [Op.not]: { userId: user.id },
      },
      include: { model: User },
    });
    if (chats[i].name == null || chats[i].name == "")
      chats[i].name = c.User.username;
  }
  return res.status(STATUS_CODE.OK).json({ chats });
};
module.exports.getChat = async (req, res) => {
  let chat = await Chat.findByPk(req.params.id, {
    include: {
      model: User,
      through: {
        model: Participant,
        where: { [Op.not]: [{ userId: req.user.id }] },
      },
    },
  });
  if (!chat)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Chat not found" });
  return res.status(STATUS_CODE.OK).json({ chat });
};
module.exports.postChat = async (req, res) => {
  let { name, id, email, phone } = req.body;
  let userId = req.user.id;
  let user = await User.findOne({
    where: {
      [Op.or]: [{ id }, { email }, { phone }],
    },
  });
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "User not found" });
  let chat = await user.createChat(name, userId);
  return res.status(STATUS_CODE.CREATED).json({ chat });
};
module.exports.putChat = async (req, res) => {
  let chat = await Chat.findByPk(req.params.id);
  if (!chat)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Chat not found" });
  let {} = req.body;
  chat.update({});
  return res.status(STATUS_CODE.OK).json({ chat });
};
module.exports.deleteChat = async (req, res) => {
  let chat = await Chat.findByPk(req.params.id);
  if (!chat)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Chat not found" });
  chat.destroy();
  return res.status(STATUS_CODE.OK).json({ chat });
};
