const { sequelize } = require("./model");
const DataTypes = require("sequelize");

const Recipient = sequelize.define("recipient", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  confirmHash: {
    type: DataTypes.TEXT,
  },
  validate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Recipient;
