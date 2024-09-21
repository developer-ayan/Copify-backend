const mongoose = require('mongoose');
const { database_name } = require('../utils/static-values');

const username = 'ayanahmed255';
const password = 'Hello786@';

mongoose.connect(`mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.kffyovn.mongodb.net/${database_name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
