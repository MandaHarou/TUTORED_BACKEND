const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Aucun token fourni'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decodedToken);

    const userId = decodedToken.userId;
    console.log('User ID:', userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ID utilisateur manquant'
      });
    }

    // Conversion en ObjectId de manière absolument sécurisée
    req.userId = new mongoose.Types.ObjectId(userId);
    console.log('User ObjectId:', req.userId);

    next();
  } catch (error) {
    console.error('Erreur d\'authentification détaillée:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide',
        error: error.message 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré',
        error: error.message 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Erreur de serveur',
      error: error.message 
    });
  }
};