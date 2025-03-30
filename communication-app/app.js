require('dotenv').config(); // Charger les variables d'environnement
const mongoose = require('mongoose');
const express = require('express');

const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur de communication prêt');
});

//  Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(() => {
  console.log(' Connexion à MongoDB réussie');
}).catch((err) => {
  console.error(' Erreur de connexion à MongoDB : ', err);
});

module.exports = app;
