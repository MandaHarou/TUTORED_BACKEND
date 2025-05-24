const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  setGet,
  setPost,
  updateUser,
  deletUser,
  setPut,
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  handlePhotoUpload,
  handleProfilePhotoUpload
} = require('../controllers/user.Controller');
const isAdmin = require('../middlewares/admin');
const verifyToken = require('../middlewares/authenticateToken');




router.use((req, res, next) => {
  console.log('User Routes - Incoming Request:');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});


router.get('/users', verifyToken, isAdmin, setGet);
router.post('/useradd', verifyToken, isAdmin, handlePhotoUpload, setPost);
router.patch('/users/:id', verifyToken, isAdmin, handlePhotoUpload, updateUser);
router.put('/users/:id', verifyToken, isAdmin, handlePhotoUpload, setPut);
router.delete('/users/:id', verifyToken, isAdmin, deletUser);


router.get('/profile', verifyToken, getUserProfile);
router.patch('/profile', verifyToken, updateUserProfile);
router.patch('/profile/photo', verifyToken, handleProfilePhotoUpload, updateUserPhoto);

module.exports = router;
