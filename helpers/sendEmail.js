const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "akrisia.com",
  port: 465,
  secure: true,
  auth: {
    user: "admin@akrisia.com",
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = async (data) =>
  await transporter.sendMail({
    ...data,
    from: "admin@akrisia.com",
  });

module.exports = sendEmail;
