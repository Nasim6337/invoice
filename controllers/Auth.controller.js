const User = require('../models/user-model');
const redisClient = require('../config/redis'); 
const jwt = require('jsonwebtoken');
const sendOTP = require('../Utils/otp');
const bcrypt = require('bcrypt');

// Utility to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ====== SIGNUP FLOW ======

// Send OTP for Signup
exports.sendSignupOTP = async (req, res) => {
  const { name, email, password,accountNumber,ifscCode,bankName,phone } = req.body;
  console.log(req.body)

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser?.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    const otp = generateOTP();
    const otpData = {
      name,
      email,
      otp,
      phone,
      bankDetails: {
        accountNumber,
        ifsc: ifscCode,
        bankName
      },
      password,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    
    await redisClient.set(`signup:${email}`, JSON.stringify(otpData), { EX: 600 });
    await sendOTP(email, otp);

    res.status(200).json({ message: 'Signup OTP sent to email' });
  } catch (err) {
    console.error('Signup OTP Error:', err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Verify Signup OTP and create user
exports.verifySignupOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const data = await redisClient.get(`signup:${email}`);
    if (!data) return res.status(400).json({ message: 'OTP expired or not found' });

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch {
      return res.status(500).json({ message: 'Corrupted OTP data' });
    }

    const { name, otp: savedOtp, expiresAt, password ,bankDetails} = parsed;

    if (otp !== savedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      return res.status(403).json({status:false,message:"user already exists"});
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        bankDetails,
        isVerified: true,
      });
    }

    await redisClient.del(`signup:${email}`);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , {
      expiresIn: '7d',
    });

    res.status(200).json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('Signup Verification Error:', err);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// ====== LOGIN FLOW ======

// Send OTP for Login
exports.sendLoginOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found or not verified' });
    }

    const otp = generateOTP();
    const otpData = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    
    await redisClient.setEx(`login:${email}`, 600, JSON.stringify(otpData));

    await sendOTP(email, otp);

    res.status(200).json({ message: 'Login OTP sent to email' });
  } catch (err) {
    console.error('Login OTP Error:', err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Verify OTP and Login
exports.verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const data = await redisClient.get(`login:${email}`);
      console.log(data)
    if (!data) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    let parsed;
    try {
      parsed = JSON.parse(data);
      console.log(parsed)
    } catch {
      return res.status(500).json({ message: 'Corrupted OTP data' });
    }

    const { otp: savedOtp, expiresAt } = parsed;

    if (otp !== savedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found or not verified' });
    }

    await redisClient.del(`login:${email}`);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , {
      expiresIn: '7d',
    });
    
    if(token)
    {
        return res.status(200).json({
        status:true,
        message:"login successfully",
        token
       })
    }

  } catch (err) {
    console.error('Login Verification Error:', err);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};
