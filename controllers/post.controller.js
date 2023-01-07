const Post = require("../models/post.model");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Category = require("../models/category.model");
const { Op } = require("sequelize");
const appCache = require("../config/node-cache.config");

exports.create = (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).send({ message: "Forgot picture." });
    }
    if (
      !req.body.title ||
      !req.body.content ||
      !req.body.picture ||
      !req.body.category
    ) {
      return res.status(400).send({ message: "Forgot data." });
    }
    const token = req.get("Authorization");
    const decode = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    Post.findOne({ where: { title: req.body.title } }).then((exist) => {
      if (exist) {
        res
          .status(400)
          .send({ message: "This name of title is already used. " });
        return;
      } else {
        const idOfTheAuthor = decode.id;
        Admin.findOne({ raw: true, where: { id: idOfTheAuthor } }).then(
          (admin) => {
            if (admin) {
              const categoryToFind = req.body.category;
              Category.findOne({ where: { name: categoryToFind } }).then(
                (theCategory) => {
                  if (theCategory) {
                    const category = theCategory.id;
                    const title = req.body.title;
                    const content = req.body.content;
                    const picture = req.body.picture;
                    Post.create({
                      title,
                      author: admin.name,
                      content,
                      picture,
                      categoryId: category,
                    }).then((post) => {
                      appCache.del("allPostsWithCategory");
                      appCache.del("allPostsWithoutCategory");
                      appCache.del("allNoveltyPosts");
                      return res.status(200).json({ post });
                    });
                  } else {
                    res.status(400).send({
                      message: "Please create a category or choose a valid.",
                    });
                    return;
                  }
                }
              );
            } else {
              res.status(401).send({ message: "You're not connect." });
            }
          }
        );
      }
    });
  } catch (e) {
    logger.log("error", " post controller => create : " + e);
    res.status(500).send({ message: "Error :" + e });
  }
};

exports.findAllPostsWithCategory = (req, res) => {
  try {
    if (appCache.has("allPostsWithCategory")) {
      const posts = appCache.get("allPostsWithCategory")
      return res.status(200).json({ posts: posts });
    }
    Post.findAll({ where: { categoryId: { [Op.ne]: null } } }).then((posts) => {
      appCache.set("allPostsWithCategory", posts);
      res.status(200).json({ posts });
    });
  } catch (e) {
    logger.log("error", " post controller => findAllPostsWithCategory : " + e);
    res.status(500).send({ mesage: "Error: " + e });
  }
};

exports.findAllPostsWithoutCategory = (req, res) => {
  try {
    if (appCache.has("allPostsWithoutCategory")) {
      const posts = appCache.get('allPostsWithoutCategory')
      return res.status(200).json({ posts: posts });
    }
    Post.findAll({ where: { categoryId: { [Op.is]: null } } }).then((posts) => {
      appCache.set("allPostsWithoutCategory", posts);
      res.status(200).json({ posts });
    });
  } catch (e) {
    logger.log(
      "error",
      " post controller => findAllPostsWithoutCategory : " + e
    );
    res.status(500).send({ message: "Error : " + e });
  }
};

exports.findOnePost = (req, res) => {
  try {
    const idOfPost = req.params.id;
    Post.findOne({ raw: true, where: { id: idOfPost } }).then((post) => {
      if (post) {
        res.status(200).json({ post });
      } else {
        res.status(404).send({ message: "Any post found." });
      }
    });
  } catch (e) {
    logger.log("error", " post controller => findOnePost : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};

exports.findByCategories = (req, res) => {
  try {
    const categoryId = req.params.id;
    Post.findAll({ where: { categoryId } }).then((posts) => {
      if (posts) {
        res.status(200).json({ posts });
      } else {
        res.status(400).send({ message: "Any post wanted on this category." });
      }
    });
  } catch (e) {
    logger.log("error", " post controller => findByCategories : " + e);
    res.status(500).send({ message: "Error : " + e });
  }
};

exports.update = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOne({ raw: true, where: { id: postId } }).then((post) => {
      if (post) {
        const categoryName = req.body.category;
        Category.findOne({ where: { name: categoryName } }).then((category) => {
          if (category) {
            const title = req.body.title;
            const content = req.body.content;
            const picture = req.body.picture;
            Post.update(
              { title, content, picture, categoryId: category.id },
              { where: { id: postId } }
            );
            appCache.del("allPostsWithCategory");
            appCache.del("allPostsWithoutCategory");
            appCache.del("allNoveltyPosts");
            return res
              .status(200)
              .send({ message: "Post successfully updated." });
          } else {
            return res.status(400).send({ message: "Any category was found." });
          }
        });
      } else {
        return res
          .status(400)
          .send({ message: "Any post was found with this id." });
      }
    });
  } catch (e) {
    logger.log("error", " post controller => update : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};

exports.novelty = (req, res) => {
  try {
    if (appCache.has("allNoveltyPosts")) {
      const posts = appCache.get("allNoveltyPosts")
      return res.status(200).json({ posts: posts });
    }
    const posts = [];
    const dateNow = new Date();
    const dateNowTT = Math.floor(dateNow.getTime() / 1000);
    Post.findAll({}).then((allPosts) => {
      if (allPosts) {
        allPosts.forEach((post) => {
          const dateOfPost = new Date(post.createdAt);
          const dateOfPostTT = Math.floor(dateOfPost.getTime() / 1000);
          const compareTT = dateNowTT - dateOfPostTT;
          if (compareTT > 1296000) {
            return;
          } else {
            posts.push(post);
          }
        });
        if (posts.length != 0) {
          appCache.set("allNoveltyPosts", posts);
          res.status(200).json({ posts: posts });
        } else {
          res.status(404).send({ message: "Any new posts." });
        }
      } else {
        res.status(404).send({ message: "Any new post." });
      }
    });
  } catch (e) {
    logger.log("error", " post controller => novelty : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};

exports.delete = (req, res) => {
  try {
    const postId = req.params.id;
    Post.destroy({ where: { id: postId } }).then((valid) => {
      if (valid == 1) {
        appCache.del("allPostsWithCategory");
        appCache.del("allPostsWithoutCategory");
        appCache.del("allNoveltyPosts");
        res.status(200).send({ message: "Post successfully deleted." });
      } else {
        res.status(404).send({ message: "Can't delete this post : No exist." });
      }
    });
  } catch (e) {
    logger.log("error", " post controller => delete : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};
