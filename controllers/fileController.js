const File = require('../models/fileModel');
const Message = require('../models/messageModel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

exports.uploadFile = async (req, res) => {
  try {
    console.log('Requête de fichier reçue:', req.file);
    console.log('Corps de la requête:', req.body);
    console.log('ID Utilisateur:', req.userId);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier uploadé',
        details: {
          file: req.file,
          body: req.body
        }
      });
    };

    // Vérifier que recipientId est un ObjectId valide
    const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

    // Correction de la vérification du chemin
    const filePath = req.file.path;
    console.log('Chemin du fichier vérifié:', filePath);

    // Créer un nouveau message avec le fichier
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content: req.file.originalname,
      hasAttachment: true
    });

    await message.save();

    // Créer l'entrée de fichier
    const file = new File({
      messageId: message._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: filePath,
      uploadedBy: req.userId
    });

    await file.save();

    // Mettre à jour le message avec la référence du fichier
    message.attachment = file._id;
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Fichier uploadé avec succès',
      file: file
    });
  } catch (error) {
    console.error('Erreur complète:', error);
    
    // Gestion des erreurs spécifiques
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'ID utilisateur ou destinataire invalide',
        error: error.message 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'upload', 
      error: error.message 
    });
  }
};



exports.listUploadedFiles = (req, res) => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la lecture des fichiers',
        error: err.message 
      });
    }
    
    res.status(200).json({
      success: true,
      files: files
    });
  });
};

exports.downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Fichier non trouvé' 
    });
  }

  // Télécharger le fichier
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Erreur de téléchargement:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors du téléchargement du fichier',
        error: err.message 
      });
    }
  });
};
// Reste du code inchangé