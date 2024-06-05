const { STATUS_CODE } = require("#enums/status_code");
const User = require("#models/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.verifyCredentials(email, password);
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "Invalid email or password" });
  let token = await user.createAuthAccessTokens();
  return res.status(STATUS_CODE.OK).json({ token, user });
};

module.exports.register = async (req, res) => {
  let { username, email, phone, password, image } = req.body;
  let [ user, isCreated ] = await User.findOrCreate({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
    defaults: { username, email, phone, password },
  });
  if (!isCreated)
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: "User already exists" });
  // user = await User.create({ username, email, phone, password });
  return res.status(STATUS_CODE.CREATED).json({ user });
};

module.exports.logout = async (req, res) => {
  let user = req.user;
  let token = req.token;
  let accessToken = user.auth_access_tokens.find((accessToken) =>
    bcrypt.compareSync(token, accessToken.hashToken)
  );
  await accessToken.destroy();
  return res.status(STATUS_CODE.OK).json({ message: "Logout success" });
};