const mongoose = require('mongoose');
const { database_name } = require('../utils/static-values');

const username = 'ayanahmed255'; // Replace with your actual username
const password = 'Hello786@'; // Replace with your actual password (URL-encoded if necessary)
const uri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.kffyovn.mongodb.net/${database_name}?retryWrites=true&w=majority`;


mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
