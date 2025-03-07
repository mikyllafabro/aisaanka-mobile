require('dotenv').config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT, 10), // Ensure the port is an integer
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Export transporter as a default export
module.exports = transporter;