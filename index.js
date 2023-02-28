const express = require("express");
const app = express();
const logger = require("./config/logger.config");
const cors = require("cors");
const port = 8005;
const bodyParser = require("body-parser");
const fs = require('fs');
const https = require('https');

const credentials = {
  key: fs.readFileSync('/etc/letsencrypt/live/wwidev.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/wwidev.tech/fullchain.pem')
};



// app.options('*', cors())
app.use(cors({
  origin: '*'
}));

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'https://wwidev.tech');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Credentials', false);
//   next();
// });

app.use(bodyParser.json());
require("dotenv").config();

app.set("view engine", "ejs");


app.use((req, res, next) => {
  if (req.secure) {
    // La requête est déjà sécurisée en HTTPS, pas besoin de rediriger
    next();
  } else {
    // Rediriger toutes les requêtes HTTP vers HTTPS
    res.redirect(301, "https://" + req.headers.host + req.url);
  }
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

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port '+port);
  logger.log('info', 'Success runnin https')
});



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
 