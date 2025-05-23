const mongoose = require('mongoose');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.getConversations = async (req, res) => {
  try {
    // Conversion sécurisée de l'ID
    const userId = req.userId || new mongoose.Types.ObjectId(req.body.id || req.query.id);
    
    console.log('ID utilisateur pour les conversations:', userId);
    console.log('Type de l\'ID:', typeof userId);
    console.log('Est un ObjectId:', userId instanceof mongoose.Types.ObjectId);

    // Récupérer tous les utilisateurs avec qui l'utilisateur a eu des interactions
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' },
          unreadCount: { 
            $sum: { 
              $cond: [
                { $and: [
                  { $ne: ['$recipient', userId] },
                  { $eq: ['$isRead', false] }
                ]},
                1, 
                0 
              ]
            } 
          }
        }
      },
      {
        $lookup: {
          from: 'users', // Assurez-vous que c'est le bon nom de collection
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: '$_id',
          name: '$userDetails.name',
          photo: '$userDetails.photo',
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            sender: '$lastMessage.sender'
          },
          unreadCount: '$unreadCount'
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Si aucune conversation, renvoyer une liste vide
    if (conversations.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations',
      error: error.toString()
    });
  }
};

// Nouvelle méthode pour récupérer les messages d'une conversation spécifique
exports.getConversationMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });

    // Marquer les messages comme lus
    await Message.updateMany(
      { 
        sender: otherUserId, 
        recipient: userId,
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.toString()
    });
  }
};

// Obtenir les messages d'une conversation spécifique
exports.getMessages = async (req, res) => {
  try {
    const userId = req.userId; // Obtenu du middleware d'authentification
    const otherUserId = req.params.userId;
    
    // Vérifier si l'autre utilisateur existe
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Paramètres de pagination
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    // Récupérer les messages
    const messages = await Message.getMessages(userId, otherUserId, limit, skip);
    
    // Marquer les messages comme lus
    await Message.markAsRead(userId, otherUserId);
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
      pagination: {
        limit,
        skip
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

// Envoyer un nouveau message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId; // Obtenu du middleware d'authentification
    const { recipientId, content } = req.body;
    
    // Validation des données
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un destinataire et un contenu pour le message'
      });
    }
    
    // Vérifier si le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }
    
    // Créer le message
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content
    });
    
    // Récupérer le message avec les informations de l'expéditeur
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name photo')
      .lean();
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
    
    // Note: La notification en temps réel est gérée par Socket.IO dans app.js
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// Marquer les messages comme lus
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId; // Obtenu du middleware d'authentification
    const otherUserId = req.params.userId;
    
    const result = await Message.markAsRead(userId, otherUserId);
    
    res.status(200).json({
      success: true,
      message: 'Messages marqués comme lus',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage des messages comme lus',
      error: error.message
    });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.userId; // Obtenu du middleware d'authentification
    const messageId = req.params.messageId;
    
    // Vérifier si le message existe et appartient à l'utilisateur
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur est l'expéditeur du message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce message'
      });
    }
    
    // Supprimer le message
    await Message.findByIdAndDelete(messageId);
    
    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message',
      error: error.message
    });
  }
};