const { sequelize } = require("./model");
const DataTypes = require("sequelize");

const Category = sequelize.define("categories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Category;
