import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Politique de Confidentialité de ShareAlbum</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p className="mb-4">
        Cette Politique de Confidentialité explique comment <strong>ShareAlbum</strong> collecte, utilise, et protège vos informations personnelles. En utilisant notre application, vous acceptez les pratiques décrites dans cette politique.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Données Collectées</h2>
      <p className="mb-4">
        Nous collectons les informations suivantes lorsque vous utilisez notre application :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Informations de Compte Google : ID Google, adresse e-mail, nom, prénom, photo de profil.</li>
        <li>Refresh Token : Utilisé pour maintenir la connexion avec Google Drive.</li>
        <li>Contenu des Albums : Photos ajoutées dans les albums créés.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Utilisation des Données</h2>
      <p className="mb-4">
        Les informations collectées sont utilisées pour :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Authentification : Vous identifier et vous connecter à l'application.</li>
        <li>Création et Gestion des Albums : Créer des albums photo et les stocker sur votre Google Drive.</li>
        <li>Partage : Permettre le partage des albums avec d'autres utilisateurs.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Partage des Données</h2>
      <p className="mb-4">
        Nous ne partageons vos données personnelles avec aucune autre entité, sauf si cela est nécessaire pour fournir les services de l'application (par exemple, le stockage des photos sur Google Drive).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Sécurité</h2>
      <p className="mb-4">
        Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre l'accès non autorisé, la divulgation, l'altération, ou la destruction.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Vos Droits</h2>
      <p className="mb-4">
        Vous avez le droit d'accéder, de corriger, ou de supprimer vos informations personnelles. Pour exercer ces droits, veuillez nous contacter à <strong>lucaslhomme01@gmail.com</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Modifications de la Politique</h2>
      <p className="mb-4">
        Nous pouvons modifier cette Politique de Confidentialité de temps à autre. Les changements seront publiés sur cette page avec une date de révision mise à jour.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
      <p>
        Pour toute question ou préoccupation concernant notre politique de confidentialité, veuillez nous contacter à <strong>lucaslhomme01@gmail.com</strong>.
      </p>
    </div>
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
    </>
  );
}

export default PrivacyPolicy;
