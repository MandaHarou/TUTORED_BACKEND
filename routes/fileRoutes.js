const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/fileController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploads');

// Route pour uploader un fichier
router.post('/upload', 
  verifyToken, 
  upload.single('file'), 
  fileController.uploadFile
);

// Liste des fichiers uploadés
router.get('/files', verifyToken, fileController.listUploadedFiles);

// Téléchargement d'un fichier
router.get('/download/:filename', verifyToken, fileController.downloadFile);

module.exports = router;