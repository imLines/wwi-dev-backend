const createTransporter = require("../config/gmailAPI.config");
const Recipient = require("../models/recipient.model");
const jwt = require("jsonwebtoken");
const proxy = require("../config/proxy.config");
const logger = require("../config/logger.config.js");
const { ExceptionHandler } = require("winston");

exports.createRecipient = async (req, res) => {
  try {
    if (req.body.email == null) {
      return res
        .status(400)
        .send({ message: "You need to provide a valide email." });
    }
    const email = req.body.email;
    Recipient.findOne({ raw: true, where: { email: email } }).then(
      (recipient) => {
        if (recipient) {
          if (recipient.validate == true) {
            return res
              .status(400)
              .send({ message: "You already have suscribe to the newsletter" });
          } else {
            Recipient.destroy({ raw: true, where: { email: email } });
          }
        }

        const token = jwt.sign(
          { email: email },
          process.env.SECRET_KEY_CONFIRM_NEWSLETTER,
          { expiresIn: "1 day" }
        );
        Recipient.create({ email, confirmHash: token });
        const mailSubject = "Confirm you're email";
        const ejs = require("ejs");
        const path = require("path");
        ejs
          .renderFile(
            path.join(__dirname, "../template/templateSuscribe.ejs"),
            {
              proxy: proxy,
              token: token,
            }
          )
          .then((result) => {
            async function sendMail() {
              try {
                let mailOptions = {
                  from: process.env.EMAIL,
                  to: req.body.email,
                  subject: mailSubject,
                  html: result,
                };
                let emailTransporter = await createTransporter();

                if (emailTransporter == undefined) {
                  throw "Failed to get AccessToken.";
                }

                emailTransporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    throw new Error("Failed to send email: " + error);
                  } else {
                    console.log("Email sent: " + info.response);
                    return res.status(200).send({
                      message:
                        "The confirmation email was send. Please check you're emailBox " +
                        email +
                        " and click confirmation mail button for begin get newsletter.",
                    });
                  }
                });
              } catch (e) {
                logger.log(
                  "error",
                  "newsletter controller => createRecipent/sendMail() :" + e
                );
                return res
                  .status(503)
                  .send({ message: "Error when send email: " + e });
              }
            }
            sendMail();
          });
      }
    );
  } catch (e) {
    logger.log("error", "newsletter controller => createRecipent :" + e);
    res.status(500).send({ message: "Error : " + e });
  }
};

exports.confirmEmail = (req, res) => {
  try {
    const token = req.params.token;
    Recipient.findOne({ where: { confirmHash: token } }).then((recipient) => {
      if (recipient) {
        jwt.verify(
          recipient.confirmHash,
          process.env.SECRET_KEY_CONFIRM_NEWSLETTER,
          function (err, decoded) {
            if (err) {
              return res
                .status(400)
                .send({ message: "Error in confirmation : " + err });
            }
            Recipient.update(
              { confirmHash: "", validate: true },
              { where: { email: recipient.email } }
            );
            res
              .status(200)
              .send({ message: "Email was successfully confirmed." });
          }
        );
      } else {
        res
          .status(400)
          .send({ message: "This link is already used or invalid." });
      }
    });
  } catch (e) {
    logger.log("error", "newsletter controller => confirmEmail : " + e);
    res.status(500).send({ message: "Error : " + e });
  }
};

exports.createLetter = async (req, res) => {
  try {
    if (!req.body.picture || !req.body.title || !req.body.url) {
      res.status(400).send({
        message: "Need to provide picture, title and url to the post",
      });
    }

    const ejs = require("ejs");
    const path = require("path");
    ejs
      .renderFile(path.join(__dirname, "../template/templateNewsletter.ejs"), {
        picture: req.body.picture,
        title: req.body.title,
        link_post: req.body.url,
      })
      .then((result) => {
        Recipient.findAll({ where: { validate: true } }).then(
          (allRecipients) => {
            if (allRecipients) {
              allRecipients.map((recipient) => {
                async function sendEmail() {
                  try {
                    let mailOptions = {
                      from: process.env.EMAIL,
                      to: recipient.email,
                      subject: "New post wwiDEV",
                      html: result,
                    };

                    let emailTransporter = await createTransporter();
                    if (emailTransporter == undefined) {
                      logger.log(
                        "error",
                        "newsletter.controller => Fail to create transporter"
                      );
                      throw new Error(
                        "Can't create transporter for send Mail."
                      );
                    }
                    emailTransporter.sendMail(
                      mailOptions,
                      function (error, info) {
                        if (error) {
                          logger.log(
                            "error",
                            "newsletter.controller => SendMail()",
                            error
                          );
                          throw new Error("Can't send mail : " + error);
                        } else {
                          console.log("Email sent: " + info.response);
                          return res.status(200).send({ message: "Success" });
                        }
                      }
                    );
                  } catch (e) {
                    logger.log('error', 'newsletter controller => createLetter(sendMail) : ' + e)
                    return res
                      .status(500)
                      .send({ message: "Error when send mail : " + e });
                  }
                }

                sendEmail();
              });
            }
          }
        );
      });
  } catch (e) {
    logger.log("error", "newsletter controller => createLetter : " + e);
    res.status(500).send({ err: "Error : " + e });
  }
};
