const { STATUS_CODE } = require("#enums/status_code");
const User = require("#models/user");
const { Op } = require("sequelize");

module.exports.getUsers = async (req, res) => {
  let users = await User.findAll();
  return res.status(STATUS_CODE.OK).json({ users });
};
module.exports.getUser = async (req, res) => {
  let user = await User.findOne({
    where: {
      [Op.or]: [
        { id: req.params.id },
        { email: req.params.id },
        { phone: req.params.id },
      ],
    },
  });
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "User not found" });
  return res.status(STATUS_CODE.OK).json({ user });
};
module.exports.postUser = async (req, res) => {
  let { username, email, password, image } = req.body;
  let user = await User.create({ username, email, password, image });
  return res.status(STATUS_CODE.CREATED).json({ user });
};
module.exports.putUser = async (req, res) => {
  let user = await User.findByPk(req.params.id);
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "User not found" });
  let { username, email, image } = req.body;
  user.update({ username, email, image });
  return res.status(STATUS_CODE.OK).json({ user });
};
module.exports.deleteUser = async (req, res) => {
  let user = await User.findByPk(req.params.id);
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "User not found" });
  user.destroy();
  return res.status(STATUS_CODE.OK).json({ user });
};
