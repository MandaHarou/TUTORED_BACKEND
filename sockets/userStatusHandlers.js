
function handleDisconnect(socket, connectedUsers) {
  console.log('Déconnexion socket:', socket.id);
  
  if (socket.userId) {
    
    connectedUsers.delete(socket.userId);
    
   
    socket.broadcast.emit('userStatusChanged', { 
      userId: socket.userId, 
      status: 'offline' 
    });
  }
}

module.exports = { initialize, handleDisconnect };