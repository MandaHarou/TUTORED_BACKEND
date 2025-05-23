const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports.login = async (req, res) => {
    try {
        console.log('==== REQUÊTE DE CONNEXION ====');
        console.log('Données reçues:', req.body);

        const { name, token } = req.body;

        if (!name || !token) {
            return res.status(400).json({ error: 'Nom ou identifiant manquant !' });
        }

        const user = await User.findOne({ name, token });

        if (!user) {
            console.log('Utilisateur non trouvé:', { name, token });
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }

        console.log('Utilisateur trouvé:', user);
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('JWT généré pour l\'utilisateur');

        user.isConnected = true;
        await user.save();
        console.log('Statut de connexion mis à jour: true');

        res.json({
            message: 'Connexion réussie',
        
            
            redirect: user.role === 'administrateur' ? '/admin-dashboard' : '/user-account'
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ error: 'Erreur de connexion', details: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ error: 'ID utilisateur manquant' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        user.isConnected = false;
        await user.save();
        console.log('Utilisateur déconnecté:', userId);

        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        res.status(500).json({ error: 'Erreur de déconnexion', details: error.message });
    }
};