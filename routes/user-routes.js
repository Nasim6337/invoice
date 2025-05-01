const express = require('express');
const { getProfile, updateProfile, searchUsers } = require('../controllers/user-controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/search', protect, searchUsers);

module.exports = router;