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
} = require('../controllers/userControllers');
const isAdmin = require('../middlewares/admin');
const verifyToken = require('../middlewares/authenticateToken');

/*
              Main
 */

// Middleware de log global pour le débogage
router.use((req, res, next) => {
  console.log('User Routes - Incoming Request:');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// Routes pour les administrateurs (gestion de tous les utilisateurs)
router.get('/users', verifyToken, isAdmin, setGet);
router.post('/useradd', verifyToken, isAdmin, handlePhotoUpload, setPost);
router.patch('/users/:id', verifyToken, isAdmin, handlePhotoUpload, updateUser);
router.put('/users/:id', verifyToken, isAdmin, handlePhotoUpload, setPut);
router.delete('/users/:id', verifyToken, isAdmin, deletUser);

// Routes pour les utilisateurs (gestion de leur propre profil)
router.get('/profile', verifyToken, getUserProfile);
router.patch('/profile', verifyToken, updateUserProfile);
router.patch('/profile/photo', verifyToken, handleProfilePhotoUpload, updateUserPhoto);

module.exports = router;
