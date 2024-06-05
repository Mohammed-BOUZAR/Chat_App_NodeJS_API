const { DataTypes } = require("sequelize");
const sequelize = require("#config/database");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Attachment;
