const User = require('../models/user');
const Album = require('../models/album');  // Assurez-vous que ce modèle est correctement importé
const jwt = require('jsonwebtoken');


const sendUserProfil = async (req, res, next) => {
    try {
        const userId = res.locals.userId; // Attention à utiliser `req.locals` si c'est ce que vous utilisez
        const userSearched = await User.findOne({ userId });
        console.log(userSearched);
        res.status(200).json(userSearched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addUserToBDD = (userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("User Data:", userData);

            
            const existingUser = await User.findOne({ userId: userData.userId });
            if (existingUser) {
                return resolve({ message: 'Utilisateur déjà existant.', user: existingUser, status: 200 });
            }
            
            // Vérification des champs requis
            if (!userData.userId || !userData.name || !userData.email || !userData.pictureUrl || !userData.refreshToken) {
                return reject({ message: 'Les données utilisateur sont incomplètes.', status: 400 });
            }
            
            const newUser = new User({
                userId: userData.userId,
                name: userData.name,
                email: userData.email,
                pictureUrl: userData.pictureUrl,
                refreshToken: userData.refreshToken,
                albums: userData.albums || {}
            });

            await newUser.save();
            resolve({ message: 'Nouvel utilisateur ajouté.', user: newUser, status: 201 });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
            reject({ message: 'Erreur lors de l\'ajout de l\'utilisateur.', error: error.message, status: 500 });
        }
    });
};

const addUser = (req, res, next) => {
    const user = res.locals.user.data;
    const { tokens } = res.locals;

    if (!user || !tokens) {
        return res.status(400).json({ message: "Les informations d'authentification sont manquantes." });
    }

    const userData = {
        userId: user.id || user.sub,
        name: user.name,
        email: user.email,
        pictureUrl: user.picture,
        refreshToken: tokens.refresh_token,
        albums: []
    };

    addUserToBDD(userData)
        .then(() => next())
        .catch(err => {
            console.error("Erreur dans addUser:", err.message);
            res.status(err.status || 500).json({ message: err.message });
        });
};

const isAlbumCreator = async (req,res,next) => {
    const token = req.query.token ||
                req.headers['x-access-token'] ||
                req.cookies.sessionToken;
    const { AlbumId } = req.body
    let userCreatorFromAlbum
    if (token == null || AlbumId == null) return res.sendStatus(401)

    try {
        const albumSearched = await Album.findById(AlbumId)
        userCreatorFromAlbum = albumSearched.userCreatorId
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        if (userCreatorFromAlbum === user.userId) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    })
}

const isAlbumCreatorMiddelware = async (req,res,next) => {
    const token = req.query.token ||
                req.headers['x-access-token'] ||
                req.cookies.sessionToken;
    const { albumId } = req.body
    let userCreatorFromAlbum
    if (token == null || albumId == null) return res.sendStatus(401)

    try {
        const albumSearched = await Album.findById(albumId)
        userCreatorFromAlbum = albumSearched.userCreatorId
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        if (userCreatorFromAlbum === user.userId) {
            next()
        } else {
            res.sendStatus(400)
        }
    })
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = res.locals.userId

        const userDeleted = await User.deleteOne({ userId })
        if (!userDeleted) {
            res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
        } else {
            res.status(200).json({succes : true, message: "Utilisateur suprimé"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({succes:false, message:"erreur lors de la supression de l'utilisateur"})
    }
}

const deleteAlbumFromUser = async (req, res, next) => {
    try {
        const albumId = req.body.albumId;
        const userId = res.locals.userId

      // Récupérer l'utilisateur par son userId
      const user = await User.findOne({ userId });
  
      if (!user) {
        res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
      }
  
      // Filtrer la liste des albums pour retirer celui qui a l'albumId correspondant
      const updatedAlbums = user.albums.filter(album => album.albumId !== albumId);
  
      // Vérifier si l'album existait bien
      if (updatedAlbums.length === user.albums.length) {
        res.status(400).json({ success: false, message: "Album non trouvé" });
      }
  
      // Mettre à jour l'utilisateur avec la nouvelle liste d'albums
      user.albums = updatedAlbums;
      await user.save(); // Sauvegarder la modification
      console.log("User album suprimé")
      res.status(200).json({message :"album suprimé"})
    } catch (error) {
      console.error("Erreur lors de la suppression de l'album :", error);
      res.status(500).json({ success: false, message: "Erreur lors de la suppression de l'album" });
    }
  };
  


module.exports = { addUser, sendUserProfil, isAlbumCreator, isAlbumCreatorMiddelware, deleteAlbumFromUser };