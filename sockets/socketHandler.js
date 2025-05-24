const Message = require('../models/messageModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
   
    socket.on('authenticate', (token) => {
      
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

    
    module.exports = (io) => {
      io.on('connection', (socket) => {
        socket.on('authenticate', async (userId) => {
          try {
            
            const user = await User.findById(userId);
            if (!user) return;
    
            
            const pendingMessages = await Message.getPendingMessages(userId);
            
         
            socket.emit('pendingMessages', pendingMessages);
            
           
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