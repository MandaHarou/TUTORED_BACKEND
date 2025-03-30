const express = require('express');
const Message = require('../models/messageModel');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

// Envoyer un message
router.post('/', authenticateToken, async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();
    res.status(200).send('Message envoyé');
  } catch (err) {
    res.status(500).send('Erreur lors de l\'envoi du message');
  }
});

// Récupérer les messages d'un utilisateur
router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ receiverId: userId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des messages');
  }
});

module.exports = router;
