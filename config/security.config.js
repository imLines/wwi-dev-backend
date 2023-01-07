const jwt = require("jsonwebtoken");
const logger = require("./logger.config");

function checkToken(req, res, next) {
  try {
    const token = req.get("Authorization");
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY_TOKEN,
      function (error, decoded) {
        if (error) {
          logger.log(
            "info",
            "Try to get/modify/create/delete protected action but no token valid was provided"
          );
          return res
            .status(401)
            .send({ message: "You need to be login for continue" });
        }
        next();
      }
    );
  } catch (e) {
    logger.log("info", "Try to access protected route with error : " + e);
    res.status(401).send({ message: "Error :" + e });
  }
}

module.exports = checkToken;
