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

// Custom middleware to validate JWT token for Socket.IO connections
module.exports.isAuthSocket = async (socket, next) => {
  const token = socket.handshake.query.token; // Assuming the token is passed as a query parameter
  if (!token) {
    return next(new Error("Token is required"));
  }

  let data;
  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new Error("Invalid token"));
  }

  const user = await User.findOne({
    include: "auth_access_tokens",
    where: { id: data.id },
  });

  if (!user) {
    return next(new Error("User not found"));
  }

  const isValid = user.auth_access_tokens.find((accessToken) =>
    bcrypt.compareSync(token, accessToken.hashToken)
  );

  if (!isValid) {
    return next(new Error("Unauthorized"));
  }

  // Set the user ID on the socket object
  socket.id = user.id;
  next();
};
