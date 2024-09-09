const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://lucaslhomme01:${process.env.MONGO_DB_MDP}@cluster0.7jxz1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log('Connected!')
    
    console.log('Connecté à MongoDB!');

    // Exemple d'ajout d'un nouvel utilisateur
    const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        pictureUrl: 'https://example.com/picture.jpg',
        refreshToken: 'some-refresh-token',
        albums: {}
    };

    addUser(userData);

  });

const User = require('./models/user')

const addUser = async (userData) => {
    try {
        // Créer une instance du modèle User avec les données fournies
        const newUser = new User({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            pictureUrl: userData.pictureUrl,
            refreshToken: userData.refreshToken,
            albums: userData.albums || {}
        });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();
        console.log('Nouvel utilisateur ajouté avec succès:', newUser);
    } catch (error) {
        if (error.code === 11000) {
            console.error('Erreur: Un utilisateur avec cet email existe déjà.');
        } else {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        }
    }
};