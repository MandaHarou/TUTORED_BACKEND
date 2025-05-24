const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const messageController = require('../controllers/message.Controller');


router.use((req, res, next) => {
  verifyToken(req, res, next);
});


router.get('/conversations', messageController.getConversations);
router.get('/conversation/:userId', messageController.getConversationMessages);


router.get('/:userId', messageController.getMessages);


router.post('/', messageController.sendMessage);


router.patch('/:userId/read', messageController.markAsRead);


router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;