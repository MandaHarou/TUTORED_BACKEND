const Message = require('../models/messageModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Authentification du socket (à implémenter)
    socket.on('authenticate', (token) => {
      // Vérifier le token et récupérer l'ID utilisateur
      // Cette partie dépend de votre implémentation d'authentification
    });

    socket.on('check-pending-files', async (userId) => {
      try {
        const pendingMessages = await Message.find({
          recipient: userId,
          hasAttachment: true,
          fileStatus: 'pending'
        }).populate('attachment');

        if (pendingMessages.length > 0) {
          socket.emit('pending-files', pendingMessages);
        }
      } catch (error) {
        console.error('Erreur de vérification des fichiers en attente:', error);
      }
    });

    // Autres événements socket si nécessaire
    module.exports = (io) => {
      io.on('connection', (socket) => {
        socket.on('authenticate', async (userId) => {
          try {
            // Vérifier l'authentification
            const user = await User.findById(userId);
            if (!user) return;
    
            // Récupérer les messages en attente
            const pendingMessages = await Message.getPendingMessages(userId);
            
            // Émettre les messages en attente au client
            socket.emit('pendingMessages', pendingMessages);
            
            // Marquer les messages comme livrés
            await Message.markMessagesAsDelivered(userId);
          } catch (error) {
            console.error('Erreur de socket:', error);
          }
        });
    
        socket.on('sendMessage', async (messageData) => {
          try {
            const message = new Message({
              sender: messageData.senderId,
              recipient: messageData.recipientId,
              content: messageData.content,
              status: 'pending'
            });
            
            await message.save();
            
            // Émettre le message au destinataire s'il est connecté
            const recipientSocket = getUserSocket(messageData.recipientId);
            if (recipientSocket) {
              recipientSocket.emit('newMessage', message);
            }
          } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
          }
        });
      });
    };
  });
};