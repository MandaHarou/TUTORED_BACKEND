// socketManager.js
const socketIO = require('socket.io');
const messageHandlers = require('./messageHandlers');
const authHandlers = require('./authHandlers');
const userStatusHandlers = require('./userStatusHandlers');

// Map pour stocker les utilisateurs connectés
const connectedUsers = new Map();

// Fonction d'initialisation de Socket.IO
function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*", // Autorise toutes les origines en développement
      methods: ["GET", "POST"]
    }
  });

  // Middleware d'authentification global
  io.use((socket, next) => {
    // Vous pouvez ajouter un middleware d'authentification ici si nécessaire
    next();
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);
    
    // Initialiser les gestionnaires d'événements
    authHandlers.initialize(io, socket, connectedUsers);
    messageHandlers.initialize(io, socket, connectedUsers);
    userStatusHandlers.initialize(io, socket, connectedUsers);
    
    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      userStatusHandlers.handleDisconnect(socket, connectedUsers);
    });
  });

  return io;
}

module.exports = { initializeSocket };