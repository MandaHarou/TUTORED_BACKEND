// controllers/userControllers.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const upload = require('../middlewares/uploads');
const multer = require('multer');

// Middleware pour gérer l'upload de photos
module.exports.handlePhotoUpload = (req, res, next) => {
  console.log('==== TRAITEMENT DE LA REQUÊTE UPLOAD ====');
  console.log('Content-Type complet:', req.headers['content-type']);
  
  // Si la requête est multipart/form-data, utiliser multer
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

// Fonction pour créer un nouvel utilisateur
module.exports.setPost = async (req, res) => {
    try {
        // Logs détaillés pour le débogage
        console.log('==== REQUÊTE DE CRÉATION UTILISATEUR ====');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('File:', req.file);
        
        // Traitement du fichier photo
        let photoPath = '';
        
        // Si un fichier a été uploadé
        if (req.file) {
            console.log('Fichier détecté:', req.file.originalname);
            
            // Vérifier que le fichier existe
            if (fs.existsSync(req.file.path)) {
                console.log('Fichier sauvegardé avec succès à:', req.file.path);
                // Chemin relatif pour accéder à l'image via HTTP
                photoPath = `/uploads/${path.basename(req.file.path)}`;
                console.log('Chemin de la photo enregistré:', photoPath);
            } else {
                console.error('Le fichier n\'existe pas à:', req.file.path);
            }
        } 
        // Si une URL a été fournie (solution alternative)
        else if (req.body.photoUrl) {
            if (Array.isArray(req.body.photoUrl)) {
                photoPath = req.body.photoUrl[0];
            } else {
                photoPath = req.body.photoUrl;
            }
            console.log('URL de photo fournie:', photoPath);
        } else {
            console.log('Aucune photo fournie');
        }
        
        const { name, role, token, email } = req.body;
        let isConnected = req.body.isConnected || false;
        
        // Conversion de isConnected en booléen si c'est une chaîne
        if (typeof isConnected === 'string') {
            isConnected = isConnected.toLowerCase() === 'true';
        }
        
        // Validation des champs
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: "Nom invalide!" });
        }
        if (!role || typeof role !== 'string') {
            return res.status(400).json({ message: "Rôle invalide!" });
        }
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: "Token invalide!" });
        }
        
        // Vérification de l'utilisateur existant
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            // Supprimer le fichier si l'utilisateur existe déjà
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(409).json({ message: "Un utilisateur avec ce nom existe déjà!" });
        }
        
        // Création de l'utilisateur
        const newUser = await User.create({
            name,
            email: email || '', // Email optionnel
            role,
            token,
            isConnected,
            photo: photoPath
        });
        
        console.log('Utilisateur créé avec succès:', newUser);
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erreur lors de la création d\'un utilisateur:', error);
        
        // Supprimer le fichier en cas d'erreur
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Erreur lors de la suppression du fichier:', unlinkError);
            }
        }
        
        res.status(500).json({
            error: 'Erreur serveur',
            message: 'Une erreur inattendue s\'est produite lors de la création de l\'utilisateur',
            details: error.message
        });
    }
};

// Fonction pour récupérer tous les utilisateurs
module.exports.setGet = async (req, res) => {
    try {
        const liste = await User.find();
        res.status(200).json(liste);
    } catch (error) {
        res.status(401).json({ error: "Bad request" });
    }
};

// Fonction pour récupérer le profil de l'utilisateur connecté
module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Retourner les informations de l'utilisateur sans le token pour des raisons de sécurité
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

// Fonction pour mettre à jour le profil de l'utilisateur connecté
module.exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;
        
        // Validation des données
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

// Middleware pour gérer l'upload de photo de profil
module.exports.handleProfilePhotoUpload = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Erreur lors de l\'upload de la photo', error: err.message });
    }
    next();
  });
};

// Fonction pour mettre à jour la photo de profil de l'utilisateur connecté
module.exports.updateUserPhoto = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Si aucun fichier n'a été uploadé
        if (!req.file) {
            return res.status(400).json({ message: 'Aucune photo fournie' });
        }
        
        // Chemin de la photo
        const photoPath = `/uploads/${req.file.filename}`;
        
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

// Fonction pour mettre à jour un utilisateur
module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, token, isConnected } = req.body;
        
        // Traitement du fichier photo
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

// Fonction pour remplacer un utilisateur
module.exports.setPut = async (req, res) => {
    try {
        // Implémentation similaire à updateUser mais avec remplacement complet
        const { id } = req.params;
        const { name, email, role, token, isConnected } = req.body;
        
        // Traitement du fichier photo
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

// Fonction pour supprimer un utilisateur
module.exports.deletUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Si l'utilisateur avait une photo, la supprimer
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
