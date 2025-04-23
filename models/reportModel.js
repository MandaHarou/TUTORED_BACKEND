const mongoose = require('mongoose');
/*
              Main
 */
const reportSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'En attente' },  // "En attente" jusqu'à ce que le PDG le consulte
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
/*
              End
 */
module.exports = Report;
