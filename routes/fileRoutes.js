const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploads');

// Route pour uploader un fichier
router.post('/upload', 
  authMiddleware, 
  upload.single('file'), 
  fileController.uploadFile
);

// Route pour télécharger un fichier
router.get('/download/:fileId', 
  authMiddleware, 
  (req, res) => fileController.downloadFile(req, res)
);

module.exports = router;