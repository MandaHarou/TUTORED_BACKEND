// userStatusHandlers.js

function initialize(io, socket, connectedUsers) {
  // Vous pouvez ajouter d'autres événements liés au statut utilisateur ici
}

function handleDisconnect(socket, connectedUsers) {
  console.log('Déconnexion socket:', socket.id);
  
  if (socket.userId) {
    // Supprimer l'utilisateur de la liste des connectés
    connectedUsers.delete(socket.userId);
    
    // Informer les autres utilisateurs du changement de statut
    socket.broadcast.emit('userStatusChanged', { 
      userId: socket.userId, 
      status: 'offline' 
    });
  }
}

module.exports = { initialize, handleDisconnect };