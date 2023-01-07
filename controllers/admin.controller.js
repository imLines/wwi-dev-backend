const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger.config");

exports.login = (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Please fill all fields." });
    }
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({ raw: true, where: { email: email } }).then((admin) => {
      if (admin) {
        bcrypt.compare(password, admin.password).then((valid) => {
          if (valid) {
            const token = jwt.sign(
              { id: admin.id },
              process.env.SECRET_KEY_TOKEN,
              { expiresIn: "3h" }
            );
            return res.status(200).json({ token });
          } else {
            logger.log(
              "info",
              " admin controller => login : Invalid password."
            );
            return res
              .status(400)
              .send({ message: "Invalid email / password." });
          }
        });
      } else {
        logger.log("info", " admin controller => login : Invalid email.");
        res.status(400).send({ message: "Invalid email / password." });
      }
    });
  } catch (e) {
    logger.log("error", " admin controller => login : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};

exports.create = (req, res) => {
  try {
    if (!req.body.email || !req.body.name || !req.body.password) {
      res.status(400).send({ message: "Please fill all fields." });
    } else {
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;
      const saltRounds = 10;
      Admin.findOne({ raw: true, where: { email: email } }).then((result) => {
        if (result) {
          logger.log(
            "info",
            " admin controller => create : try to create account with : " +
            email
          );
          res.status(400).send({
            message: "Email already use. Please select another email or login.",
          });
        } else {
          bcrypt.hash(password, saltRounds).then((hashedPassword) => {
            Admin.create({ email, name, password: hashedPassword });
            res
              .status(200)
              .send({ message: "Admin was successfull created !" });
          });
        }
      });
    }
  } catch (e) {
    logger.log("error", "admin controller => create : " + e);
    res.status(500).send({ message: "Error : " + e });
  }
};

exports.getInformations = (req, res) => {
  try {
    const token = req.get("Authorization");
    const getId = jwt.decode(token, process.env.SECRET_KEY_TOKEN);
    if (!getId.id) {
      logger.log(
        "info",
        " admin controller => getInformations : Invalid token."
      );
      res.status(401).send({ message: "Invalide Token." });
    } else {
      Admin.findOne({ where: { id: getId.id } }).then((admin) => {
        if (admin) {
          res.status(200).json({ admin });
        } else {
          res.status(400).send({ message: "Any admin was found." });
        }
      });
    }
  } catch (e) {
    logger.log("error", " admin controller => getInformations : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};

exports.update = (req, res) => {
  try {
    const adminId = req.params.id;
    Admin.findOne({ raw: true, where: { id: adminId } }).then((admin) => {
      if (admin) {
        const token = req.get("Authorization");
        const checkTokenId = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
        if (checkTokenId.id == adminId) {
          const email = req.body.email;
          const password = req.body.password;
          const name = req.body.name;
          Admin.update(
            { email, password, name },
            { where: { id: adminId } }
          ).then((success) => {
            if (success == 1) {
              res.status(200).send({ message: "Updated" });
            } else {
              res.status(500).send({ message: "Error: " });
            }
          });
        } else {
          res.status(401).send({ message: "No authorized." });
        }
      } else {
        res.status(400).send({ message: "No admin was found." });
      }
    });
  } catch (e) {
    logger.log("error", " admin controller => update : " + e);
    res.status(500).send({ message: "Error: " + e });
  }
};
