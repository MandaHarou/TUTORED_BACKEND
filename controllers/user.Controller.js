const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const upload = require('../middlewares/uploads');
const multer = require('multer');


module.exports.handlePhotoUpload = (req, res, next) => {
  console.log('==== TRAITEMENT DE LA REQUÊTE UPLOAD ====');
  console.log('Content-Type complet:', req.headers['content-type']);
  
  
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    console.log('Détection de multipart/form-data, application de multer');
    upload.single('photo')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Erreur Multer:', err);
        return res.status(400).json({ message: 'Erreur lors de l\'upload de fichier', error: err.message });
      } else if (err) {
        console.error('Erreur inconnue:', err);
        return res.status(500).json({ message: 'Erreur lors de l\'upload de fichier', error: err.message });
      }
      console.log('Upload réussi, fichier:', req.file);
      next();
    });
  } else {
    console.log('Traitement de la requête JSON standard');
    next();
  }
};


exports.setPost = async (req, res) => {
    try {
      
      const { name, email, role, token, isConnected } = req.body;
      
      
      let finalIsConnected = false;
      if (typeof isConnected === 'string') {
          finalIsConnected = isConnected.toLowerCase() === 'true';
      }
      
      
      if (!name) {
        return res.status(400).json({ message: "Le nom est requis!" });
      }
      
      
      if (name.trim().length < 2) {
        return res.status(400).json({ message: "Le nom doit contenir au moins 2 caractères" });
      }
  
     
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return res.status(409).json({ message: "Un utilisateur avec ce nom existe déjà!" });
      }
  
      
      let photoPath = null;
      if (req.file) {
        photoPath = req.file.path; 
        console.log('Chemin de la photo uploadée:', photoPath);
      } else {
        console.log('Aucune photo fournie');
      }
  
    
      const newUser = await User.create({
        name,
        email: email || '', 
        role,
        token,
        photo: photoPath || '', 
        isConnected: finalIsConnected
      });
  
   
      const userResponse = newUser.toObject();
      delete userResponse.password;
  
      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: userResponse
      });
  
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Erreur lors de la suppression du fichier:', unlinkError);
        }
      }
  
      res.status(500).json({ 
        message: "Erreur lors de la création de l'utilisateur",
        error: error.message 
      });
    }
  };

module.exports.setGet = async (req, res) => {
    try {
        const liste = await User.find();
        res.status(200).json(liste);
    } catch (error) {
        res.status(401).json({ error: "Bad request" });
    }
};


module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo,
            isConnected: user.isConnected
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


module.exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;
        
       
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            message: 'Profil mis à jour avec succès',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


module.exports.handleProfilePhotoUpload = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Erreur lors de l\'upload de la photo', error: err.message });
    }
    next();
  });
};


module.exports.updateUserPhoto = async (req, res) => {
    try {
        const userId = req.userId;
        
        
        let photoPath = '';
        if (req.file) {
            photoPath = `/uploads/${req.file.filename}`;
        } 
        
        else if (req.body.photoUrl) {
            photoPath = req.body.photoUrl;
        } 
        else {
            
            photoPath = '';
        }
        
        const user = await User.findByIdAndUpdate(userId, { photo: photoPath }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            message: 'Photo de profil mise à jour avec succès',
            photo: photoPath
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la photo:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, token, isConnected } = req.body;

        let photoPath = undefined;
        if (req.file) {
            photoPath = `/uploads/${path.basename(req.file.path)}`;
        }
        
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (token) updates.token = token;
        if (isConnected !== undefined) updates.isConnected = isConnected;
        if (photoPath) updates.photo = photoPath;
        
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur mise à jour partielle' });
    }
};


module.exports.setPut = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { name, email, role, token, isConnected } = req.body;
        
       
        let photoPath = '';
        if (req.file) {
            photoPath = `/uploads/${path.basename(req.file.path)}`;
        }
        
        const user = await User.findByIdAndUpdate(id, {
            name,
            email,
            role,
            token,
            isConnected,
            photo: photoPath
        }, { new: true, overwrite: true });
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            message: 'Utilisateur remplacé avec succès',
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur mise à jour totale' });
    }
};

module.exports.deletUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        
        if (user.photo && user.photo.startsWith('/uploads/')) {
            const photoPath = path.join(__dirname, '..', user.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }
        
        res.json({
            message: 'Utilisateur supprimé avec succès',
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur suppression' });
    }
};
