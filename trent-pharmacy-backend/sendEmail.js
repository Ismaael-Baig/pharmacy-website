const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, service, date, time, notes }) => {
  // Create a transporter using Gmail; adjust if using a different service.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail account (e.g., yourGmail@gmail.com)
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  // Setup email options
  const mailOptions = {
    from: `"${name}" <${email}>`, // Sender details
    to: process.env.BUSINESS_EMAIL, // Recipient email from your environment variables
    subject: `New Appointment Request - ${service}`, // Subject line
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
    `,
  };

  // Send the email and return the Promise
  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
