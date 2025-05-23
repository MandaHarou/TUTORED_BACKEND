const mongoose = require('mongoose');
const User = require('../models/userModel');
/*
              Main
*/
const bdconect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/communication-app", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log("Connecté à MongoDB");
    } catch (err) {
        console.error("Erreur MongoDB :", err);
        process.exit(1);
    }
};
/*
              End
 */
module.exports = bdconect;