const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sendEmail = require('./sendEmail');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/book', async (req, res) => {
  const { name, email, service, date, time, notes } = req.body;
  try {
    await sendEmail({ name, email, service, date, time, notes });
    res.status(200).json({ message: 'Booking email sent successfully!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ message: 'Failed to send booking email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
