const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/log.Controller');
const verifyToken = require('../middlewares/authenticateToken');

router.post('/login', login);


router.post('/logout', verifyToken, logout);


module.exports = router;
