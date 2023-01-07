module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const category = require("../controllers/category.controller");
  const checkToken = require("../config/security.config");

  router.get("/all", category.findAllCategories);
  router.post("/new", checkToken, category.create);
  router.put("/update/:id", checkToken, category.updateCategory);
  router.delete("/delete/:id", checkToken, category.delete);
  router.get("/:categoryId", category.findOneCategory);

  app.use("/category", router);
};
