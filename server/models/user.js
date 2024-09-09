const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma utilisateur
const userSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    refreshToken: { type: String, required: true },
    albums: [
        {
            albumId: { type: String, required: true }, // Stockage de l'ID de l'album
            albumName: { type: String, required: true } // Stockage du nom de l'album
        }
    ]
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
