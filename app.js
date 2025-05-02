const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const bdconect = require('./config/db');
const dotenv = require('dotenv').config();
const { initializeSocket } = require('./sockets/socketManager');
const fileRoutes = require('./routes/fileRoutes');

/*
             Main
 */
bdconect();
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Dossier d'uploads créé: ${uploadDir}`);
}

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = initializeSocket(server);


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Dossier uploads configuré pour les fichiers statiques:', path.join(__dirname, 'uploads'));

// Ajouter les routes de fichiers
app.use('/files', fileRoutes);




app.use('/user', require('./routes/userRoutes'));
app.use('/log', require('./routes/logroutes'));
app.use('/messages', require('./routes/messageRoutes'));


server.listen(port, () => {
  console.log(`Serveur démarré sur http://192.168.1.24:${port}`);
});
/*
              End
 */