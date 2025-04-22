const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res) => {
    const { name, token } = req.body;

    console.log('Login Attempt - Debugging Information:');
    console.log('Received Credentials:', { name, token });

    if (!name || !token) {
        return res.status(400).json({ error: 'Nom ou identifiant manquant !' });
    }

    try {
        const user = await User.findOne({ name, token });
        
        console.log('User Found:', user);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }

        const jwtToken = jwt.sign(
            { 
                id: user._id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Generated JWT Token:', jwtToken);

        user.isConnected = true;
        await user.save();

        res.json({ 
            message: 'Connexion réussie', 
            token: jwtToken, 
            role: user.role,
            redirect: user.role === 'administrateur' ? '/admin-dashboard' : '/user-account'
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Erreur de connexion', details: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.isConnected = false;
        await user.save();
        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur de déconnexion' });
    }
};