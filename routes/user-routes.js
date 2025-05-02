const express = require('express');
const { getProfile, updateProfile, searchUsers } = require('../controllers/user-controller');
const { protect } = require('../middleware/auth.middleware');
const checkLogin=require('../middleware/auth-land-middleware');
const router = express.Router();

const {getProfileInfo,editProfile,deleteProfile}=require('../controllers/Profile-controller');

// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile);
// router.get('/search', protect, searchUsers);

router.get('/profile',checkLogin,getProfileInfo);
router.put('/editProfile',checkLogin,editProfile);
router.post('/deleteUser',checkLogin,deleteProfile);

module.exports = router;