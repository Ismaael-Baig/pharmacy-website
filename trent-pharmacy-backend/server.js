require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sendEmail = require('./sendEmail');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route to indicate the backend is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Route to handle booking submissions
app.post('/api/book', (req, res) => {
  const { name, email, service, date, time, notes } = req.body;

  // Validate required fields
  if (!name || !email || !service || !date || !time) {
    return res.status(400).send('Please fill out all required fields.');
  }

  // Construct email content
  const emailOptions = {
    to: process.env.BUSINESS_EMAIL || 'badcoopo@gmail.com',
    subject: 'New Booking Submission',
    text: `New booking details:

Name: ${name}
Email: ${email}
Service: ${service}
Date: ${date}
Time: ${time}
Notes: ${notes || 'N/A'}
`
  };

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
