const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['membre', 'employé', 'administrateur'] },
  ip: { type: String, required: true },
  token: { type: String, required: true },  // Token d'authentification
  isConnected: { type: Boolean, default: false },  // Indique si l'utilisateur est connecté
});

const User = mongoose.model('User', userSchema);

module.exports = User;
