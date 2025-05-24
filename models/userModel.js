const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false }, 
  role: { type: String, required: true, enum: ['membre', 'employé', 'administrateur']},
  photo: { type: String, default: '' }, 
  token: { type: String, required: true },  
  isConnected: { type: Boolean, default: false },  
});

const User = mongoose.model('User', userSchema);


module.exports = User;
