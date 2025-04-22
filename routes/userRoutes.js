const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {setGet, setPost, updateUser, deletUser, setPut} = require('../controllers/userControllers');
const isAdmin = require('../middlewares/admin');
const verifyToken = require('../middlewares/authenticateToken');

// Middleware de log global
router.use((req, res, next) => {
  console.log('User Routes - Incoming Request:');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Route pour récupérer un utilisateur (accessible à tous les utilisateurs connectés)
router.get('/users/:id', verifyToken, setGet); 

// Routes réservées à l'admin
router.post('/useradd', verifyToken, isAdmin, setPost);
router.patch('/users/:id', verifyToken, isAdmin, updateUser);
router.put('/users/:id', verifyToken, isAdmin, setPut);
router.delete('/users/:id', verifyToken, isAdmin, deletUser);

module.exports = router;
