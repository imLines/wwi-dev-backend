const jwt = require("jsonwebtoken");
const logger = require("./logger.config");

function accessRequest(req, res) {
  try {
    const token = req.get("Authorization");
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY_TOKEN,
      function (error, decoded) {
        if (error) {
          logger.log("info", "Try to do unauthorized request.");
          return res
            .status(401)
            .send({ message: "You need to be login for continue." });
        }
        res.status(200).send({ message: "authorized." });
      }
    );
  } catch (e) {
    logger.log("error", " accessConfig : " + e);
    res.status(500).send({ message: "Error :" + e });
  }
}

module.exports = accessRequest;
