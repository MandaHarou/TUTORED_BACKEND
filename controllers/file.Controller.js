const File = require('../models/file.models');
const Message = require('../models/messageModel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

exports.uploadFile = async (req, res) => {
  try {


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

    
    const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

    
    const filePath = req.file.path;
    console.log('Chemin du fichier vérifié:', filePath);

    
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content: req.file.originalname,
      hasAttachment: true
    });

    await message.save();

   
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

    
    message.attachment = file._id;
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Fichier uploadé avec succès',
      file: file
    });
  } catch (error) {
    console.error('Erreur complète:', error);
    
    
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
  
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Fichier non trouvé' 
    });
  }

  
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
