const mongoose = require('mongoose');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.getConversations = async (req, res) => {
  try {
  
    const userId = req.userId || new mongoose.Types.ObjectId(req.body.id || req.query.id);
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
          from: 'users', 
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


exports.getMessages = async (req, res) => {
  try {
    const userId = req.userId; 
    const otherUserId = req.params.userId;
    
    
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
   
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    

    const messages = await Message.getMessages(userId, otherUserId, limit, skip);
    
   
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


exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId; 
    const { recipientId, content } = req.body;
    
    
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un destinataire et un contenu pour le message'
      });
    }
    
   
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }
    
    
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content
    });
    
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name photo')
      .lean();
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
    
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId; 
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


exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.userId; 
    const messageId = req.params.messageId;
    
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce message'
      });
    }
    
   
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