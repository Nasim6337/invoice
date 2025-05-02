const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth.controller');

// Signup Routes
router.post('/signup/send-otp', auth.sendSignupOTP);
router.post('/signup/verify-otp', auth.verifySignupOTP);

// Login Routes
router.post('/login/send-otp', auth.sendLoginOTP);
router.post('/login/verify-otp', auth.verifyLoginOTP);

module.exports = router;
