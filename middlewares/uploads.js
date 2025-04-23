const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Dossier créé: ${uploadDir}`);
}

console.log('Configuration du middleware d\'upload...');
console.log('Dossier d\'upload:', uploadDir);

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination du fichier:', uploadDir);
        // Vérifier que le dossier existe avant d'y écrire
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('Dossier créé pendant l\'upload');
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nom de fichier unique
        const uniqueFilename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        console.log('Nom du fichier généré:', uniqueFilename);
        cb(null, uniqueFilename);
    }
});

// Configuration du filtre pour les images
const fileFilter = (req, file, cb) => {
    console.log('Fichier reçu:', file);
    // Accepter uniquement les images
    if (file.mimetype.startsWith('image/')) {
        console.log('Type de fichier accepté:', file.mimetype);
        cb(null, true);
    } else {
        console.log('Type de fichier rejeté:', file.mimetype);
        cb(new Error('Seules les images sont autorisées !'), false);
    }
};

// Configuration de multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    }
});

// Vérifier que multer est correctement configuré
console.log('Middleware d\'upload configuré avec succès');

module.exports = upload;