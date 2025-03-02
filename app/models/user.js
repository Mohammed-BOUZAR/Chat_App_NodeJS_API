const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("#migrations/user");
const AuthAccessTokens = require("#migrations/access_tokens");
const Chat = require("#migrations/chat");
const Participant = require("#migrations/participant");
const Message = require("#migrations/message");
const Attachment = require("#migrations/attachment");

User.verifyCredentials = async function (email, pass) {
  const user = await User.findOne({ where: { email } });
  if (!user) return false;
  const isValid = await bcrypt.compare(pass, user.password);
  user.password = undefined;
  return isValid ? user : false;
};

User.prototype.createAuthAccessTokens = async function () {
  let token = jwt.sign({ id: this.id }, process.env.JWT_SECRET);
  let hashedToken = bcrypt.hashSync(token, 10);
  // console.log("user create: ", this, token, hashedToken);
  // create a new auth access token using the relation ship
  await AuthAccessTokens.create({
    userId: this.id,
    hashToken: hashedToken,
    abilities: "user:*",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  return token;
};

User.prototype.createChat = async function (name, userId) {
  let participant1 = await Participant.findOne({ where: { userId: this.id } });
  let participant2 = await Participant.findOne({ where: { userId } });
  if (
    participant1 !== null &&
    participant2 !== null &&
    participant1?.chatId === participant2?.chatId
  )
    return false;
  let chat = await Chat.create({ name });
  await Participant.create({ userId: this.id, chatId: chat.id });
  await Participant.create({ userId, chatId: chat.id });
  return chat;
};

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.hasMany(AuthAccessTokens, {
  foreignKey: "userId",
  foreignKeyConstraint: true,
});

AuthAccessTokens.belongsTo(User, {
  foreignKey: "userId",
  foreignKeyConstraint: true,
});

User.belongsToMany(Chat, {
  through: "Participant",
  foreignKey: "userId",
  otherKey: "chatId",
  foreignKeyConstraint: true,
  otherKeyConstraint: true,
});

Chat.belongsToMany(User, {
  through: "Participant",
  foreignKey: "chatId",
  otherKey: "userId",
  foreignKeyConstraint: true,
  otherKeyConstraint: true,
});

Participant.belongsTo(User, {
  foreignKey: "userId",
  foreignKeyConstraint: true,
});

Participant.belongsTo(Chat, {
  foreignKey: "chatId",
  foreignKeyConstraint: true,
});

User.hasMany(Participant, {
  foreignKey: "userId",
  foreignKeyConstraint: true,
});

Chat.hasMany(Participant, {
  foreignKey: "chatId",
  foreignKeyConstraint: true,
});

Participant.hasMany(Message, {
  foreignKey: "participantId",
  foreignKeyConstraint: true,
});

Message.belongsTo(Participant, {
  foreignKey: "participantId",
  foreignKeyConstraint: true,
});

Chat.hasMany(Message, {
  foreignKey: "chatId",
  foreignKeyConstraint: true,
});

Message.belongsTo(Chat, {
  foreignKey: "chatId",
  foreignKeyConstraint: true,
});

Message.hasMany(Attachment, {
  foreignKey: "messageId",
  foreignKeyConstraint: true,
});

Attachment.belongsTo(Message, {
  foreignKey: "messageId",
  foreignKeyConstraint: true,
});

module.exports = User;
