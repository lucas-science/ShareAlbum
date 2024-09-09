const mongoose = require('mongoose');
const User = require('../models/user');
const Album = require('../models/album');

const createNewHomeAlbum = async (req, res, next) => {
    try {
        const { HomeName } = req.body;
        const creatorId = res.locals.userId;

        if (!HomeName || !creatorId) {
            return res.status(400).json({ message: "Les données de l'album sont incomplètes." });
        }

        // Vérifiez si l'album existe déjà dans les albums du créateur
        const user = await User.findOne({userId : creatorId}).exec();
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const existingAlbum = user.albums.find(album => album.albumName === HomeName);
        if (existingAlbum) {
            return res.status(400).json({ message: 'Cet album existe déjà dans la liste de l\'utilisateur.' });
        }

        // Créez un nouvel album
        const newAlbum = new Album({
            albumName: HomeName,
            userCreatorId: creatorId // Assurez-vous que creatorId est bien un ObjectId
        });

        await newAlbum.save();

        if (!newAlbum || !newAlbum._id) {
            return res.status(500).json({ message: 'Erreur lors de la création de l\'album.' });
        }

        // Convertir l'ID de l'album en chaîne de caractères
        const newAlbumId = newAlbum._id.toString();

        // Mettez à jour l'utilisateur avec l'ID et le nom de l'album
        await User.findOneAndUpdate(
            {
                userId:creatorId
            },
            { 
                $addToSet: { 
                    albums: {
                        albumId: newAlbumId,
                        albumName: HomeName
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );
        // Passez l'album dans res.locals et vérifiez
        res.locals.album = { HomeName, newAlbumId: newAlbum._id.toString() };
        console.log('res.locals.album:', res.locals.album); // Ajoutez cette ligne pour déboguer

        next();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'album:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'album.' });
    }
};

const getAlbumInfos = async (req, res, next) => {
    const albumId = req.params.albumId 
    if(!albumId) { res.status(401) }
    try {
        const albumSearched = await Album.findById(albumId)
        res.status(200).json(albumSearched)
    } catch(err) {
        console.log(err)
        res.status(500)
    }
}

const deleteAlbum = async (req, res , next) => {
    const { albumId } = req.body
    try {
        const deletedAlbum = await Album.findOneAndDelete(albumId)
        console.log("album suprimé")
        next()
    } catch (err) {
        res.status(500).json({message : "erreur lors de la supression de l'album"})
    }
}


module.exports = { createNewHomeAlbum, getAlbumInfos, deleteAlbum };
