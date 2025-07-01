// utils/mailHelper.js

const nodemailer = require('nodemailer');

exports.verificationAccountMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Gajanan Skill Tech" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || "",   // fallback for clients that can't render HTML
    html: options.html || "",      // send the HTML version
  };

  await transporter.verificationAccountMail(mailOptions);
};
