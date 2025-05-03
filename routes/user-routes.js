const express = require('express');
const checkLogin=require('../middleware/auth-land-middleware');
const router = express.Router();

const {getProfileInfo,editProfile,deleteProfile,businessDetail,getBusinessDetail,updateBusinessDetail}=require('../controllers/Profile-controller');

router.get('/profile',checkLogin,getProfileInfo);
router.put('/editProfile',checkLogin,editProfile);
router.post('/deleteUser',checkLogin,deleteProfile);

router.put('/updateBusinessDetail',checkLogin,updateBusinessDetail);

router.post('/businessDetail',checkLogin,businessDetail);

router.get('/getBusinessDetail',checkLogin,getBusinessDetail);

module.exports = router;