const {google} = require('googleapis');
const fs = require('fs')
const streamifier = require('streamifier');
const { getUserData } = require('./userControllers')
const User = require('../models/user')
const Album = require('../models/album')

async function getOAuth2ClientWithId(userId) {
    const userSearched = await User.findOne({ userId })
    const { refreshToken } = userSearched

    //console.log("user Searched : ", userSearched)

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/auth/google/callback'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    return oauth2Client;
}

  const getPhotosFromAlbum = async (req, res) => {
    try {
      const albumId = req.params.albumId // Récupérer l'ID de l'album à partir des paramètres de la requête
  
      let albumSearched;
      try {
        albumSearched = await Album.findById(albumId);
      } catch(err) {
        console.error("Erreur lors de la récupération des infos du créateur de l'album", err);
        res.status(500).json({ message: "Erreur lors de la récupération des infos du créateur de l'album" });
        return; // <-- N'oubliez pas de retourner ici si une erreur est capturée
      }
  
      const userIdCreator = albumSearched.userCreatorId;
  
      // Obtenir le client OAuth2 avec l'ID de l'utilisateur créateur
      const oauth2Client = await getOAuth2ClientWithId(userIdCreator);
  
      if (!oauth2Client) {
        return res.status(401).json({ message: "Impossible d'authentifier l'utilisateur" });
      }
  
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const folderId = await getOrCreateFolder(drive, albumSearched.albumName);
  
      // Chercher tous les fichiers dans le dossier de l'album (Google Drive)
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`, // Requête pour lister les fichiers dans un dossier spécifique
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
      });
  
      const files = response.data.files;
  
      if (files.length === 0) {
        return res.status(404).json({ message: 'Aucune photo trouvée dans cet album' });
      }

      // Retourner les fichiers avec leurs liens

          // Transformer chaque lien en lien d'affichage direct
    const filesWithDirectLinks = files.map(file => ({
      ...file,
      directLink: `https://drive.google.com/uc?export=view&id=${file.id}`,
    }));

    // Retourner les fichiers avec leurs liens directs
    res.status(200).json({ files: filesWithDirectLinks });
    } catch (error) {
      console.error("Erreur lors de la récupération des photos :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des photos" });
    }
  };
  
  // Fonction pour vérifier si le dossier existe, sinon le créer
  async function getOrCreateFolder(drive, folderName) {
    try {
      const response = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      });
  
      const files = response.data.files;
      if (files.length > 0) {
        return files[0].id;
      } else {
        const fileMetadata = {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        };
        const folder = await drive.files.create({
          resource: fileMetadata,
          fields: 'id',
        });
        return folder.data.id;
      }
    } catch (error) {
      console.error('Error getting or creating folder:', error);
      throw error;
    }
  }
  

const sendPhoto = async (req, res) => {
  try {
    const albumId = req.body.albumId;
    const file = req.file; // Récupérer le fichier depuis la requête
    if (!file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    // Récupérer l'album pour obtenir le créateur
    let albumSearched;
    try {
      albumSearched = await Album.findById(albumId);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'album :", err);
      return res.status(500).json({ message: "Erreur lors de la récupération de l'album" });
    }

    const userIdCreator = albumSearched.userCreatorId;

    // Obtenir l'OAuth2 client pour le créateur de l'album
    const oauth2Client = await getOAuth2ClientWithId(userIdCreator);
    if (!oauth2Client) {
      return res.status(401).json({ message: "Impossible d'authentifier l'utilisateur" });
    }

    // Initialiser Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Vérifier ou créer le dossier sur Google Drive
    const folderId = await getOrCreateFolder(drive, albumSearched.albumName);

    // Convertir le buffer en stream
    const fileStream = streamifier.createReadStream(file.buffer);

    const fileMetadata = {
      name: file.originalname,
      parents: [folderId],
    };
    const media = {
      mimeType: file.mimetype,
      body: fileStream, // Utilisation du stream
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;

    // Mettre à jour les permissions du fichier pour le rendre public
    await drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    res.status(200).json({
      message: "Photo ajoutée avec succès",
      fileId: response.data.id,
      link: response.data.webViewLink,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la photo :", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de la photo" });
  }
};
const deleteFolder = async (req, res, next) => {
  try {
    const albumId = req.body.albumId; // ID de l'album ou du dossier à supprimer

    // Récupérer l'album pour obtenir les détails
    let albumSearched;
    try {
      albumSearched = await Album.findById(albumId);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'album :", err);
      return res.status(500).json({ message: "Erreur lors de la récupération de l'album" });
    }

    const userIdCreator = albumSearched.userCreatorId;

    // Obtenir l'OAuth2 client pour le créateur de l'album
    const oauth2Client = await getOAuth2ClientWithId(userIdCreator);
    if (!oauth2Client) {
      return res.status(401).json({ message: "Impossible d'authentifier l'utilisateur" });
    }

    // Initialiser Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Chercher le dossier de l'album sur Google Drive
    const folderId = await getOrCreateFolder(drive, albumSearched.albumName);
    
    // Supprimer le dossier avec ses fichiers
    await drive.files.delete({
      fileId: folderId, // ID du dossier à supprimer
    });
    console.log("dossier suprimé")
    next()
  } catch (error) {
    console.error("Erreur lors de la suppression du dossier :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du dossier" });
  }
};

  
  const isFolderAlreadyHere = async (req, res, next) => {
    try {
      const { HomeName, newAlbumId } = res.locals.album
      const userId = res.locals.userId

        const OAuth2Client = await getOAuth2ClientWithId(userId);
        if (!OAuth2Client) {
            return res.status(401).json({ message: "Impossible d'authentifier l'utilisateur" });
        }

        // Initialisation du client Google Drive
        const drive = google.drive({ version: 'v3', auth: OAuth2Client });

        // Récupération ou création du dossier
        const folderId = await getOrCreateFolder(drive, HomeName);

        console.log("folderId :", folderId);

        // Réponse réussie
        res.status(200).json({ newAlbumId });
        
    } catch (error) {
        console.error("Erreur lors de la gestion du dossier :", error);

        // Gestion des erreurs inattendues
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
  module.exports = { isFolderAlreadyHere, getPhotosFromAlbum, sendPhoto, deleteFolder};