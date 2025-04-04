require('dotenv').config(); // Load .env file

const express = require('express');
const cors = require('cors');
const sendEmail = require('./sendEmail');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route to show that the backend is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Route to handle booking submissions (changed from /contact to /api/book)
app.post('/api/book', (req, res) => {
  // Expect the booking form to send firstName, lastName, email, phoneNumber, and message in req.body
  const { firstName, lastName, email, phoneNumber, message } = req.body;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).send('Please fill out all required fields.');
  }
  
  // Construct the email options using the submitted data
  const emailOptions = {
    to: process.env.BUSINESS_EMAIL || 'badcoopo@gmail.com', // Use env variable or fallback
    subject: 'New Booking Submission',
    text: `You have received a new booking from your website:

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
      res.status(200).send('Your booking has been received and confirmed.');
    })
    .catch((error) => {
      res.status(500).send('Error sending booking confirmation: ' + error.message);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
