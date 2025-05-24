const socketIO = require('socket.io');
const messageHandlers = require('./messageHandlers');
const authHandlers = require('./authHandlers');
const userStatusHandlers = require('./userStatusHandlers');


const connectedUsers = new Map();


function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });


  io.use((socket, next) => {
   
    next();
  });


  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);
    

    authHandlers.initialize(io, socket, connectedUsers);
    messageHandlers.initialize(io, socket, connectedUsers);
    userStatusHandlers.initialize(io, socket, connectedUsers);
    
    
    socket.on('disconnect', () => {
      userStatusHandlers.handleDisconnect(socket, connectedUsers);
    });
  });

  return io;
}

module.exports = { initializeSocket };