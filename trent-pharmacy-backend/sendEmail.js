const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, service, date, time, notes }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // e.g. yourGmailAccount@gmail.com
      pass: process.env.EMAIL_PASS,  // e.g. an app password
    },
  });

  await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: process.env.BUSINESS_EMAIL,  // e.g. yourBusinessAccount@gmail.com
    subject: `New Appointment Request - ${service}`,
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Notes:</strong> ${notes}</p>
    `,
  });
};

module.exports = sendEmail;
