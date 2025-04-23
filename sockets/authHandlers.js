// authHandlers.js
const User = require('../models/userModel');

function initialize(io, socket, connectedUsers) {
  // Authentification de l'utilisateur
  socket.on('authenticate', (userData) => {
    handleAuthentication(io, socket, connectedUsers, userData);
  });
}

function handleAuthentication(io, socket, connectedUsers, userData) {
  const userId = userData.userId;
  if (userId) {
    console.log(`Utilisateur ${userId} authentifié sur socket ${socket.id}`);
    
    // Associer l'ID utilisateur au socket
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Informer l'utilisateur qu'il est connecté
    socket.emit('authenticated', { success: true });
    
    // Informer les autres utilisateurs du changement de statut
    io.emit('userStatusChanged', { userId, status: 'online' });
  } else {
    socket.emit('authenticated', { success: false, error: 'ID utilisateur manquant' });
  }
}

module.exports = { initialize };