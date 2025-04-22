const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/logContoller');
const verifyToken = require('../middlewares/authenticateToken');


// Route de connexion
router.post('/login', login);

// Route de déconnexion
router.post('/logout', verifyToken, logout);

module.exports = router;
