import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function GoogleCallBack() {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Gérer l'état du loader
  const [data, setData] = useState(null); // Stocker la réponse du fetch

  // Fonction pour effectuer la requête fetch
  const fetchGoogleCallback = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google/callback${location.search}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json(); // Parse la réponse JSON
      setData(result); // Stocker les données
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Google Callback :", error);
    } finally {
      setLoading(false); // Arrêter le loader une fois la requête terminée
    }
  };

  useEffect(() => {
    fetchGoogleCallback(); // Appeler la fonction fetch lorsque le composant est monté
  }, []); // Le tableau vide [] assure que l'effet est exécuté une seule fois après le montage

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen space-y-4">
      {loading ? ( // Afficher le loader tant que loading est true
        <div className="loader">Chargement...</div>
      ) : (
        <div>
          {data ? ( // Si les données sont reçues, les afficher
            <div>Réponse du serveur : {JSON.stringify(data)}</div>
          ) : (
            <div>Aucune donnée disponible.</div> // Si aucune donnée n'est reçue
          )}
        </div>
      )}
    </div>
  );
}

export default GoogleCallBack;
