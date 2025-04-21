const mongoose = require('mongoose');

const bdconect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/communication-app", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connecté à MongoDB");
    } catch (err) {
        console.error("Erreur MongoDB :", err);
        process.exit(1);
    }
};

module.exports = bdconect;