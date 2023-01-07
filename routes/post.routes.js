module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const post = require("../controllers/post.controller");
  const checkToken = require("../config/security.config");

  router.get("/all", post.findAllPostsWithCategory);
  router.get("/all/manage-category",checkToken,post.findAllPostsWithoutCategory);
  router.post("/new", checkToken, post.create);
  router.get("/novelty", post.novelty);
  router.delete("/delete/:id", checkToken, post.delete);
  router.put("/update/:id", checkToken, post.update);
  router.get("/category/:id", post.findByCategories);
  router.get("/:id", post.findOnePost);

  app.use("/post", router);
};
