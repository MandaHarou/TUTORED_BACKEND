const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Accès refusé');

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).send('Token invalide');

    req.user = await User.findById(user.id);  // Associer l'utilisateur au request
    next();
  });
};

module.exports = authenticateToken;
