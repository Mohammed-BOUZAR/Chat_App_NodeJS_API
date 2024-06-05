const { STATUS_CODE } = require("#enums/status_code");
const Participant = require("#models/participant");
const Chat = require("#models/chat");
const Message = require("#models/message");
const { Op } = require("sequelize");

module.exports.getMessages = async (req, res) => {
  let messages = await Message.findAll({ include: Participant });
  return res.status(STATUS_CODE.OK).json({ messages });
};
module.exports.getMessage = async (req, res) => {
  let message = await Message.findByPk(req.params.id);
  if (!message)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Message not found" });
  return res.status(STATUS_CODE.OK).json({ message });
};
module.exports.postMessage = async (req, res) => {
  let { message } = req.body;
  let chat = await Chat.findByPk(req.params.chatId);
  if (!chat)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Chat not found" });
  let participant = await chat.getParticipants({
    where: {
      [Op.not]: [{ userId: req.user.id }],
    },
  });
  if (!participant)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Participant not found" });
  let _message = await Message.create({
    message,
    participantId: participant.id,
    chatId: chat.id,
  });
  return res.status(STATUS_CODE.CREATED).json({ _message });
};
module.exports.putMessage = async (req, res) => {
  let _message = await Message.findByPk(req.params.id);
  if (!_message)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Message not found" });
  let { message } = req.body;
  await _message.update({ message });
  return res.status(STATUS_CODE.OK).json({ _message });
};
module.exports.deleteMessage = async (req, res) => {
  let message = await Message.findByPk(req.params.id);
  if (!message)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Message not found" });
  await message.destroy();
  return res.status(STATUS_CODE.OK).json({ message });
};
