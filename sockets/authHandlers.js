const User = require('../models/userModel');

function initialize(io, socket, connectedUsers) {
  
  socket.on('authenticate', (userData) => {
    handleAuthentication(io, socket, connectedUsers, userData);
  });
}

function handleAuthentication(io, socket, connectedUsers, userData) {
  const userId = userData.userId;
  if (userId) {
    console.log(`Utilisateur ${userId} authentifié sur socket ${socket.id}`);
    
   
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    
   
    socket.emit('authenticated', { success: true });
    
    
    io.emit('userStatusChanged', { userId, status: 'online' });
  } else {
    socket.emit('authenticated', { success: false, error: 'ID utilisateur manquant' });
  }
}

module.exports = { initialize };