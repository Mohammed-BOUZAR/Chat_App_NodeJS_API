// create a middleware to check if the user has  a valid token
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("#models/user");
const { STATUS_CODE } = require("#enums/status_code");

module.exports.isAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: "Token is required" });
  let data;
  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
  const user = await User.findOne({
    include: "auth_access_tokens",
    where: { id: data.id },
  });
  if (!user)
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: "User not found" });
  const isValid = user.auth_access_tokens.find((accessToken) =>
    bcrypt.compareSync(token, accessToken.hashToken)
  );
  if (!isValid)
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  req.user = user;
  req.token = token;
  next();
};
