const express = require("express");
const app = express();
const logger = require("./config/logger.config");
const cors = require("cors");
const port = 8005;
const bodyParser = require("body-parser");

app.use(cors({
  origin: 'https://www.wwidev.tech'
}));

app.use(bodyParser.json());
require("dotenv").config();

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log("App is running on port : " + port);
  logger.log("info", "Server started on port " + port);
})
.on("error", (e) => {
  console.log("Fail to start server : ", e.message);
  logger.log("error", "index=>listen(running app) : " + e.message);
});

app.get('/', (req, res)=>{
  res.status(200).send({message: 'Connected'})
})

//Cache
require("./config/node-cache.config");

//Models
require("./models/post.model");
require("./models/admin.model");
require("./models/category.model");
require("./models/relations.model");
require("./models/recipient.model");

//Routes
require("./routes/admin.routes")(app);
require("./routes/post.routes")(app);
require("./routes/category.routes")(app);
require("./routes/newsletter.routes")(app);

const { sequelize } = require("./models/model");
sequelize.sync({ force: false, alter: false })
.then(() => {
  console.log("Success Sync WWi-DEV database.");
  logger.log("info", "Sequelize : succes sync with database.");
})
.catch((err) => {
  console.log("Failed to sync with DB: " + err);
  logger.log("error", "Failed to sync with DB: " + err);
});
 