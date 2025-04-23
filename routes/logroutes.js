const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/logContoller');
const verifyToken = require('../middlewares/authenticateToken');
/*
              Main
 */

// Route de connexion
router.post('/login', login);

// Route de déconnexion
router.post('/logout', verifyToken, logout);

/*
              End
 */

module.exports = router;
