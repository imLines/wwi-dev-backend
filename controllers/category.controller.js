const logger = require("../config/logger.config");
const Category = require("../models/category.model");

exports.create = (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).send({ message: "Please complete all fields." });
    }
    const name = req.body.name;
    const description = req.body.description;
    Category.create({ name, description });
    res.status(200).send({ message: "Category was created." });
  } catch (e) {
    logger.log("error", " category controller => create : " + e);
    res.status(500).send({ message: "Server error for this operation. "});
  }
};

exports.findOneCategory = (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    Category.findOne({ where: { id: categoryId } })
    .then((category) => {
      if (category) {
        res.status(200).json({ category });
      } else {
        res.status(404).send({ message: "No category found." });
      }
    });
  } catch (e) {
    logger.log("error", " category controller => findOneCategory : " + e);
    res.status(500).send({ message: "Server error for this operation. "});
  }
};

exports.findAllCategories = (req, res) => {
  try {
    Category.findAll({}).then((categories) => {
      if (categories) {
        res.status(200).json({ categories });
      } else {
        res.status(404).send({ message: "No category found." });
      }
    });
  } catch (e) {
    logger.log("error", " category controller => findAllCategories : " + e);
    res.status(500).send({ message: "Server error for this operation. "});
  }
};

exports.updateCategory = (req, res) => {
  try {
    const categoryId = req.params.id;
    Category.findOne({ where: { id: categoryId } }).then((category) => {
      if (category) {
        const name = req.body.name;
        const description = req.body.description;
        Category.update(
          { name, description },
          { where: { id: categoryId } }
        ).then((valid) => {
          if (valid == 1) {
            res
              .status(200)
              .send({ message: "The categoy successfully update." });
          } else {
            res.status(400).send({ message: "The categoy can't be update." });
          }
        });
      }
    });
  } catch (e) {
    logger.log("error", " category controller => updateCategory : " + e);
    res.status(500).send({ message: "Server error for this operation. "});
  }
};

exports.delete = (req, res) => {
  try {
    const categoryId = req.params.id;
    Category.destroy({ where: { id: categoryId } });
    res.status(200).send({ message: "Success to delete." });
  } catch (e) {
    logger.log("error", " category controller => delete : " + e);
    res.status(500).send({ message: "Server error for this operation. "});
  }
};
