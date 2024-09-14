const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();

const googleControllers = require('./controllers/googleControllers');
const userControllers = require('./controllers/userControllers');
const authControllers = require('./controllers/authControllers');
const homeAlbumControllers = require('./controllers/homeAlbumControllers');
const driveControllers = require('./controllers/driveControllers');

// Connection à MongoDB
mongoose.connect(`mongodb+srv://lucaslhomme01:${process.env.MONGO_DB_MDP}@cluster0.7jxz1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connected!'));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Configuration de multer pour accepter des fichiers jusqu'à 50MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB
});

// Middleware pour le traitement des fichiers (appliqué uniquement aux routes qui traitent les fichiers)
app.use('/sendPhoto', upload.single('photo'));

// Configurer body-parser pour accepter de grandes requêtes JSON
app.use(express.json({ limit: '50mb' })); // Augmenter la limite de taille des requêtes JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Pour form-data

app.use(cookieParser());

// Routes
app.post('/sendPhoto', driveControllers.sendPhoto);

app.get('/', (req, res) => res.send("SharePhoto server"))
app.get('/test', (req, res) => res.send("Salut c'est la page de test !"));
app.get('/getAuth2GoogleUrl/:whereGo', googleControllers.getAuth2GoogleUrl);
app.get('/auth/google/callback', googleControllers.googleAuthCallBack, userControllers.addUser, authControllers.sendSessionToken);
app.get('/userProfil', authControllers.isSessionValideMidlleware, userControllers.sendUserProfil);
app.get('/isAlbumCreator', userControllers.isAlbumCreator);
app.get('/getAlbuminfos/:albumId', authControllers.isSessionValideMidlleware, homeAlbumControllers.getAlbumInfos);
app.get('/getPhoto/:albumId', authControllers.isSessionValideMidlleware, driveControllers.getPhotosFromAlbum);
app.get('/image-proxy', async (req, res) => {
  try {
    const { id } = req.query;
    const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    res.set('Content-Type', 'image/jpeg'); // Assurez-vous que le type MIME est correct
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de l\'image.');
  }
});

app.delete('/deleteUser', authControllers.isSessionValideMidlleware, userControllers.deleteUser)
app.delete('/deleteAlbum', authControllers.isSessionValideMidlleware, userControllers.isAlbumCreatorMiddelware, driveControllers.deleteFolder, homeAlbumControllers.deleteAlbum, userControllers.deleteAlbumFromUser);
app.post('/auth', authControllers.isSessionValide);
app.post('/createNewHomeAlbum', authControllers.isSessionValideMidlleware, homeAlbumControllers.createNewHomeAlbum, driveControllers.isFolderAlreadyHere);

// D'autres routes peuvent aller ici


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;