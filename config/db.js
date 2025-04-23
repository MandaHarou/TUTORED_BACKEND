const mongoose = require('mongoose');
const User = require('../models/userModel');
/*
              Main
 */
const bdconect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/communication-app", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connecté à MongoDB");

        // Vérifier et créer un utilisateur admin par défaut
        const adminExists = await User.findOne({ name: 'admin', role: 'administrateur' });
        if (!adminExists) {
            const adminUser = new User({
                name: 'admin',
                role: 'administrateur',
                token: 'admin',
                isConnected: true
            });
            await adminUser.save();
            console.log("Utilisateur admin créé par défaut");
        }
    } catch (err) {
        console.error("Erreur MongoDB :", err);
        process.exit(1);
    }
};
/*
              End
 */
module.exports = bdconect;