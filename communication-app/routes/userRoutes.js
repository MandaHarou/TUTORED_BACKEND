const express = require('express');
const router = express.Router();
const {setGet,setPost} = require('../controler/userControler');
// Route pour récupérer tous les utilisateurs (administrateurs uniquement)
router.get('/user/userId',setGet); 
// Route de connexion pour obtenir un token JWT
router.post('/useradd',setPost);

module.exports = router;
