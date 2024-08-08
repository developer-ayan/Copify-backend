const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer().none();

const { register, login } = require('../controllers/auth');

// Authentication Routes
router.post('/login', upload, login);
router.post('/register', upload, register);

module.exports = router;
