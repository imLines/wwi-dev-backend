const Categorie = require("./category.model");
const Post = require("./post.model");

Categorie.hasMany(Post);
Post.belongsTo(Categorie);
