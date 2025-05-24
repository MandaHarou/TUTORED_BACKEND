const Message = require('../models/messageModel');

function initialize(io, socket, connectedUsers) {

  socket.on('privateMessage', async (data) => {
    await handlePrivateMessage(io, socket, connectedUsers, data);
  });
}

async function handlePrivateMessage(io, socket, connectedUsers, data) {
  const { recipientId, content } = data;
  const senderId = socket.userId;
  
  if (!senderId || !recipientId || !content) {
    return socket.emit('messageError', { error: 'Données incomplètes' });
  }
  
  try {
    
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content
    });
    

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name photo')
      .lean();
    
  
    const recipientSocketId = connectedUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', populatedMessage);
    }
    
    
    socket.emit('messageSent', populatedMessage);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    socket.emit('messageError', { error: 'Erreur lors de l\'envoi du message' });
  }
}

module.exports = { initialize };