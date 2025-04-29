const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const messageController = require('../controllers/messageController');

// Vérifiez que verifyToken est bien un middleware
router.use((req, res, next) => {
  verifyToken(req, res, next);
});

// Obtenir toutes les conversations de l'utilisateur
router.get('/conversations', messageController.getConversations);
router.get('/conversation/:userId', messageController.getConversationMessages);

// Obtenir les messages d'une conversation spécifique
router.get('/:userId', messageController.getMessages);

// Envoyer un nouveau message
router.post('/', messageController.sendMessage);

// Marquer les messages comme lus
router.patch('/:userId/read', messageController.markAsRead);

// Supprimer un message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;