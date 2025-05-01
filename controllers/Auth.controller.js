const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOTP = require('../Utils/otp');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOTP(email, otp);

    const user = new User({ name, email, password: hashedPassword, otp });
    await user.save();
    res.status(201).json({ message: 'OTP sent to email. Please verify.' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    user.isVerified = true;
    user.otp = null;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};
