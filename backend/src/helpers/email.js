const nodemailer = require("nodemailer");
const logger = require("../controllers/loggerController");
const { smtpEmail, smtpPass } = require("../../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: smtpEmail,
    pass: smtpPass,
  },
});

const sendEmail = async (emailData) => {
  try {
    const mailOption = {
      from: sendEmail, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };
    const info = await transporter.sendMail(mailOption);
    logger.log("info", "message sent: %s", info.response);
  } catch (error) {
    logger.log("error", "Error occurred with sending email: ", error);
    throw error;
  }
};

module.exports = sendEmail;
