const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/file.Controller');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploads');


router.post('/upload', 
  verifyToken, 
  upload.single('file'), 
  fileController.uploadFile
);


router.get('/files', verifyToken, fileController.listUploadedFiles);


router.get('/download/:filename', verifyToken, fileController.downloadFile);

module.exports = router;