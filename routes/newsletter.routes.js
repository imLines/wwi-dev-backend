const checkToken = require("../config/security.config");

module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const newsletter = require("../controllers/newsletter.controller");

  router.post("/letter/new", checkToken, newsletter.createLetter);
  router.post("/recipient/new", newsletter.createRecipient);
  router.get("/confirm/:token", newsletter.confirmEmail);

  app.use("/newsletter", router);
};
