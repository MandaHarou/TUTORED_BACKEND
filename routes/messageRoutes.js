// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const verifyToken = require('../middlewares/authenticateToken');

// Toutes les routes nécessitent une authentification
router.use(verifyToken);

// Obtenir toutes les conversations de l'utilisateur
router.get('/conversations', getConversations);

// Obtenir les messages d'une conversation spécifique
router.get('/:userId', getMessages);

// Envoyer un nouveau message
router.post('/', sendMessage);

// Marquer les messages comme lus
router.patch('/:userId/read', markAsRead);

// Supprimer un message
router.delete('/:messageId', deleteMessage);

module.exports = router;