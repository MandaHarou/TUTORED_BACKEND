const mongoose = require('mongoose');
/*
              Main
 */

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false }, // Rendu optionnel
  role: { type: String, required: true, enum: ['membre', 'employé', 'administrateur']},
  photo: { type: String, default: '' }, // Valeur par défaut vide
  token: { type: String, required: true },  // Token d'authentification
  isConnected: { type: Boolean, default: false },  // Indique si l'utilisateur est connecté
});

const User = mongoose.model('User', userSchema);
/*
              End
 */

module.exports = User;
