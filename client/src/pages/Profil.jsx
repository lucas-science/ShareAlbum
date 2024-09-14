import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Profil = () => {
  const [userProfil, setUserProfil] = useState(null);  // État pour stocker les données utilisateur
  const [hoveredAlbum, setHoveredAlbum] = useState(null); // État pour suivre l'album survolé
  const [showDeletePopup, setShowDeletePopup] = useState(false); // État pour afficher/masquer le pop-up de suppression
  const navigate = useNavigate(); // Hook pour la navigation
  const sessionToken = Cookies.get('sessionToken')

  useEffect(() => {
    fetchUserProfil(); // Appeler la fonction pour récupérer les données
  }, []); // Le tableau vide [] signifie que l'effet ne s'exécute qu'une seule fois après le premier rendu
  
  const fetchUserProfil = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userProfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données utilisateur');
      }

      const data = await response.json(); // Convertir la réponse en JSON
      setUserProfil(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAlbumClick = (albumId) => {
    // Redirige vers la page de l'album
    navigate(`/myHome?id=${albumId}`);
  };

  const handleAlbumDelete = async (albumId) => {
    // Supprimer l'album (Appel à l'API pour supprimer l'album)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteAlbum`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        credentials: 'include',
        body: JSON.stringify({ albumId }),
      });

      if (response.ok) {
        // Mettre à jour l'état local pour retirer l'album supprimé
        setUserProfil((prevProfil) => ({
          ...prevProfil,
          albums: prevProfil.albums.filter((album) => album.albumId !== albumId),
        }));
      } else {
        console.error('Erreur lors de la suppression de l\'album');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteUser = async () => {
    // Supprimer le compte utilisateur
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Rediriger après suppression du compte
        navigate('/goodbye');
      } else {
        console.error('Erreur lors de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!userProfil) {
    // Si les données ne sont pas encore chargées
    return (
      <div className="bg-gray-100 flex items-center justify-center min-h-screen space-x-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-fast"></div>
        <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-medium"></div>
        <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-slow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-5 w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded shadow-md text-center flex flex-col items-center space-y-2">
        {/* Affichage de la photo de profil */}
        <img 
          src={userProfil.pictureUrl} 
          alt="Profil" 
          className="rounded-full w-20 h-20"
        />

        {/* Affichage du nom de l'utilisateur */}
        <h1 className="text-2xl font-bold text-gray-800">
          {userProfil.name}
        </h1>

        {/* Affichage des albums */}
        <div className="text-left w-full ">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Albums
          </h2>
          {userProfil.albums && Object.keys(userProfil.albums).length > 0 ? (
            <div className="space-y-2 flex flex-col items-center">
              {Object.keys(userProfil.albums).map(albumIndex => {
                const album = userProfil.albums[albumIndex];
                const isHovered = hoveredAlbum === album.albumId;

                return (
                  <div
                    key={album.albumId}
                    className="flex bg-gray-200 p-4 rounded w-full text-left content-center justify-between"
                    onMouseEnter={() => setHoveredAlbum(album.albumId)}
                    onMouseLeave={() => setHoveredAlbum(null)}
                  >
                    <button 
                      onClick={() => handleAlbumClick(album.albumId)}
                      className="w-full text-left"
                    >
                      {album.albumName}
                    </button>
                    <button
                      onClick={() => handleAlbumDelete(album.albumId)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md  hover:bg-red-600 transition"
                      >
                      Supprimer
                    </button>
                  </div>
                );
              })}
              <button onClick={() => navigate('/create')} className='mt-15 p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                Créer un album
              </button>
            </div>
          ) : (
            <div className='flex flex-col justify-around items-center'>
              <p className="text-gray-500">Pas d'albums créés</p>
              <button onClick={() => navigate('/create')} className='mt-5 p-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                Créer un album
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pop-up de confirmation pour la suppression du compte */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl mb-4">Êtes-vous sûr de vouloir supprimer votre compte ?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Oui
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
      <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => setShowDeletePopup(true)}
        >
          Supprimer le compte
        </button>
    </div>
  );
};

export default Profil;
