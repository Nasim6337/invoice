const User = require('../models/user-model');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
};

exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    name: { $regex: q, $options: 'i' },
    isVerified: true
  }).select('name email');
  res.json(users);
};
