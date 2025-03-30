const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authenticateToken');  // Middleware pour vérifier le token
const router = express.Router();

// Route pour récupérer tous les utilisateurs (administrateurs uniquement)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

// Route pour récupérer un utilisateur spécifique
router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
  }
});


// Route de connexion pour obtenir un token JWT
router.post('/login', async (req, res) => {
  const { ip, name } = req.body;  // Exemple simple, tu peux ajouter plus de validation

  try {
    const user = await User.findOne({ name, ip });
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Créer un token pour l'utilisateur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send('Erreur d\'authentification');
  }
});

module.exports = router;
