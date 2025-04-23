const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const bdconect = require('./config/db');
const dotenv = require('dotenv').config();
const { initializeSocket } = require('./sockets/socketManager');

/*
             Main
 */

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Dossier d'uploads créé: ${uploadDir}`);
}

const app = express();
const port = process.env.PORT || 3000;

// Création du serveur HTTP
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = initializeSocket(server);

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use(cors());

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Dossier uploads configuré pour les fichiers statiques:', path.join(__dirname, 'uploads'));

// Connexion à la base de données
bdconect();

// Routes
app.use('/user', require('./routes/userRoutes'));
app.use('/log', require('./routes/logroutes'));
app.use('/messages', require('./routes/messageRoutes'));

// Démarrage du serveur
server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
/*
              End
 */