const { DataTypes } = require("sequelize");
const sequelize = require("#config/database");

const AuthAccessTokens = sequelize.define(
  "auth_access_tokens",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hashToken: {
      type: DataTypes.STRING,
    },
    abilities: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    lastUsedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = AuthAccessTokens;
