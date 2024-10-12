// Assuming the database connection setup is in '../../config/conn'
require('dotenv').config();
require('./src/config/conn');

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors({
    // origin: 'http://51.20.41.99'  // Adjust as needed
    origin: 'http://localhost:3000'  // Adjust as needed
}));
app.use(express.static('public'))

const authRoutes = require('./src/api/routers/auth-routers');
const adminRoutes = require('./src/api/routers/admin-routers');
const appRoutes = require('./src/api/routers/app-routers');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/app', appRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});