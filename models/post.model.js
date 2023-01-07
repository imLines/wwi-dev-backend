const { sequelize } = require("./model");
const DataTypes = require("sequelize");

const Post = sequelize.define("posts", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
});

module.exports = Post;
