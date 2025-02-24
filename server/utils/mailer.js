require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

async function sendVerificationEmail(toEmail, token) {
  const mailOptions = {
    from: '"Ai SaanKa?" <no-reply@aisanka.com>',
    to: toEmail,
    subject: "Verify Your Email",
    text: `Click the link below to verify your email: 
    http://yourfrontend.com/verify?token=${token}`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
