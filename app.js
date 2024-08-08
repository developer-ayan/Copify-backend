// Assuming the database connection setup is in '../../config/conn'
require('dotenv').config();
require('./src/config/conn');

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors({origin : 'https://evcharging-be0a6.web.app'}));

const authRoutes = require('./src/api/routers/auth-routers');
const adminRoutes = require('./src/api/routers/admin-routers');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
