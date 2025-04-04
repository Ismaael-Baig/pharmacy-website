const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./sendEmail');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route to show that the backend is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Import the email module
const sendEmail = require('./sendEmail');

// Route to handle contact form submissions
app.post('/contact', (req, res) => {
  // Expect the contact form to send firstName, lastName, email, phoneNumber, and message in req.body
  const { firstName, lastName, email, phoneNumber, message } = req.body;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).send('Please fill out all required fields.');
  }
  
  // Construct the email options using the submitted data
  const emailOptions = {
    to: process.env.BUSINESS_EMAIL || 'badcoopo@gmail.com', // Use env variable or fallback
    subject: 'New Contact Form Submission',
    text: `You have received a new message from your website contact form:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phoneNumber || 'N/A'}

Message:
${message}
`
  };

  // Send the email using the sendEmail module
  sendEmail(emailOptions)
    .then(() => {
      res.status(200).send('Your message has been sent successfully.');
    })
    .catch((error) => {
      res.status(500).send('Error sending message: ' + error.message);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
