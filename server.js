// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('❌ MONGO_URI is not defined in .env file!');
  process.exit(1); // Exit if URI is not provided
}

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  fullname: String,
  mobile_number: String,
  full_address: String,
  email: String,
  gender: String,
  question_suggestion: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle POST request for form submission
app.post('/contact', async (req, res) => {
  try {
    const { fullname, mobile_number, full_address, email, gender, question_suggestion } = req.body;

    // Create a new Contact document
    const newContact = new Contact({
      fullname,
      mobile_number,
      full_address,
      email,
      gender,
      question_suggestion
    });

    // Save the contact to the database
    await newContact.save();
    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ message: 'Error saving data!' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
