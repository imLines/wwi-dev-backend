module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const admin = require("../controllers/admin.controller");
  const accessRequest = require("../config/access.config");
  const checkToken = require("../config/security.config");

  router.get("/authorization", accessRequest);
  router.post("/login", admin.login);
  router.post("/create", checkToken, admin.create);
  router.get("/info", checkToken, admin.getInformations);
  router.put("/update/:id", checkToken, admin.update);

  app.use("/admin", router);
};
