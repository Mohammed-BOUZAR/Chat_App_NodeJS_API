const { DataTypes } = require("sequelize");
const sequelize = require("#config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      is: ["^[0-9]+$", "i"],
    },
    deviceInfo: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = User;
