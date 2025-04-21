const express = require('express');
const Report = require('../models/reportModel');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

// Envoyer un rapport
router.post('/', authenticateToken, async (req, res) => {
  const { senderId, content } = req.body;

  try {
    const newReport = new Report({ senderId, content });
    await newReport.save();
    res.status(200).send('Rapport envoyé');
  } catch (err) {
    res.status(500).send('Erreur lors de l\'envoi du rapport');
  }
});

// Obtenir les rapports en attente (pour le PDG)
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ status: 'En attente' });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des rapports');
  }
});

module.exports = router;
