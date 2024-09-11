require('dotenv').config();
const express = require('express');
const cors = require('cors')
const fs = require('fs');
const multer = require('multer'); // Importer multer
const path = require('path');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();

const googleControllers = require('./controllers/googleControllers')
const userControllers = require('./controllers/userControllers')
const authControllers = require('./controllers/authControllers')
const homeAlbumControllers = require('./controllers/homeAlbumControllers')
const driveControllers = require('./controllers/driveControllers')

mongoose.connect(`mongodb+srv://lucaslhomme01:${process.env.MONGO_DB_MDP}@cluster0.7jxz1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log('Connected!'));

app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/test', (req, res, next) => res.send("Salut c'est la page de test !"))
app.get('/getAuth2GoogleUrl/:whereGo', googleControllers.getAuth2GoogleUrl)
app.get('/auth/google/callback', googleControllers.googleAuthCallBack, userControllers.addUser, authControllers.sendSessionToken);
app.get('/userProfil', authControllers.isSessionValideMidlleware ,userControllers.sendUserProfil)
app.get('/isAlbumCreator', userControllers.isAlbumCreator)
app.get('/getAlbuminfos/:albumId', authControllers.isSessionValideMidlleware, homeAlbumControllers.getAlbumInfos )
app.get('/getPhoto/:albumId',authControllers.isSessionValideMidlleware, driveControllers.getPhotosFromAlbum)
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

app.delete('/deleteAlbum',authControllers.isSessionValideMidlleware, userControllers.isAlbumCreatorMiddelware, driveControllers.deleteFolder, homeAlbumControllers.deleteAlbum, userControllers.deleteAlbumFromUser)
app.post('/auth', authControllers.isSessionValide)
app.post('/createNewHomeAlbum', authControllers.isSessionValideMidlleware, homeAlbumControllers.createNewHomeAlbum, driveControllers.isFolderAlreadyHere)
app.post('/sendPhoto', multer({ storage: multer.memoryStorage() }).single('photo'), driveControllers.sendPhoto);

// Route POST pour envoyer un fichier texte
/*
app.get('/sendphoto', async (req, res) => {
  try {
    const { refreshToken, fileName } = {refreshToken : '1//03kyuNLYfmlw3CgYIARAAGAMSNwF-L9IrRS5m2nLhqBWYWA7dC-SpA3LU1anOWi9b4PwOP_Ed_glttw-LW9ovlTN_DjNGf2EzJc4', fileName: 'test.txt'}; // Récupérer le refresh_token et le nom de fichier depuis la requête

    const filePath = path.join(__dirname, fileName); // Chemin du fichier texte local

    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ success: false, error: 'Fichier non trouvé' });
    }

    // Obtenir le client OAuth2 avec le refresh token
    const oauth2Client = getOAuth2ClientWithRefreshToken(refreshToken);

    // Télécharger le fichier dans Google Drive
    const fileId = await uploadFileToDrive(oauth2Client, filePath, fileName);

    res.status(200).send({ success: true, fileId: fileId });
  } catch (error) {
    console.error('Error in /sendphoto route:', error);
    res.status(500).send({ success: false, error: 'Erreur lors de l\'upload du fichier texte' });
  }
});
*/



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
