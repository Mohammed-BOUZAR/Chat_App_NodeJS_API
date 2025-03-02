const { STATUS_CODE } = require("#enums/status_code");
const Participant = require("#models/participant");
const { Op } = require("sequelize");

module.exports.getParticipants = async (req, res) => {
  let participants = await Participant.findAll({
    include: "User",
    where: { chatId: req.params.chatId },
  });
  return res.status(STATUS_CODE.OK).json({ participants });
};
module.exports.getParticipant = async (req, res) => {
  let participant = await Participant.findByPk(req.params.id);
  if (!participant)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Participant not found" });
  return res.status(STATUS_CODE.OK).json({ participant });
};
module.exports.postParticipant = async (req, res) => {
  let { userId, chatId } = req.body;
  let participant = await Participant.create({ userId, chatId });
  participant = await Participant.findByPk(participant.id, {
    include: "User",
  });
  return res.status(STATUS_CODE.CREATED).json({ participant });
};
module.exports.putParticipant = async (req, res) => {
  let participant = await Participant.findByPk(req.params.id);
  if (!participant)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Participant not found" });
  let { userId, chatId } = req.body;
  await participant.update({ userId, chatId });
  return res.status(STATUS_CODE.OK).json({ participant });
};
module.exports.deleteParticipant = async (req, res) => {
  let participant = await Participant.findByPk(req.params.id);
  if (!participant)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Participant not found" });
  await participant.destroy();
  return res.status(STATUS_CODE.OK).json({ message: "Participant deleted" });
};
