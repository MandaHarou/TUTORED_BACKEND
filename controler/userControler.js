const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');

module.exports.setPost = async (req, res) => {
    try {
        const { name, role, token, isConnected } = req.body;
        
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: "Nom invalide!" });
        }
        if (!role || typeof role !== 'string') {
            return res.status(400).json({ message: "Rôle invalide!" });
        }
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: "Token invalide!" });
        }
        if (isConnected === undefined || typeof isConnected !== 'boolean') {
            return res.status(400).json({ message: "Statut de connexion invalide!" });
        }
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: "Un utilisateur avec ce nom existe déjà!" });
        }
        const newUser = await User.create({ name, role, token, isConnected });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erreur lors de la création d\'un utilisateur:', error);
       
        res.status(500).json({ 
            error: 'Erreur serveur', 
            message: 'Une erreur inattendue s\'est produite lors de la création de l\'utilisateur' 
        });
    }
};

module.exports.setGet = async (req, res)=>{
    try{
        const liste = await User.find();
        res.status(200).json(liste);
    }catch(error){
        res.status(401).json({error : "Bad request"});
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Erreur modification user' });
    }
};

module.exports.deletUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(400).json({ error: 'Erreur suppression utilisateur' });
    }
};

module.exports.setPut = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Utilisateur mis à jour", updated });
    } catch (error) {
        res.status(400).json({ error: 'Erreur mise à jour totale' });
    }
};
