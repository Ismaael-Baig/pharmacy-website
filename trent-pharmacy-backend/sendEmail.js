require('dotenv').config(); // Load .env file

const nodemailer = require('nodemailer');

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env file
    pass: process.env.EMAIL_PASS  // Your email password or app password from .env file
  }
});

/**
 * Sends an email with the provided options.
 * @param {Object} options - Email options (to, subject, text, etc.)
 * @returns {Promise} - Resolves if the email is sent successfully.
 */
function sendEmail(options) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address from .env file
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: options.html, // Uncomment if you want to send HTML emails
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
