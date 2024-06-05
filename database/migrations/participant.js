const { DataTypes } = require("sequelize");
const sequelize = require("#config/database");

const Participant = sequelize.define(
  "Participant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Participant;
