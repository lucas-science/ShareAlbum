import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Politique de Confidentialité</h1>

      <p className="mb-4">
        Votre confidentialité est importante pour nous. Cette politique explique comment <strong>ShareAlbum</strong> collecte, utilise et protège les informations des utilisateurs.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Données collectées :</h2>
      <p className="mb-4">
        Lorsque vous créez un compte via Google, nous collectons les informations suivantes :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>ID Google</li>
        <li>Adresse email</li>
        <li>Nom et prénom</li>
        <li>Photo de profil</li>
        <li>Refresh token</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Utilisation des données :</h2>
      <p className="mb-4">
        Les informations collectées sont utilisées uniquement pour :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Vous identifier et vous authentifier sur l'application.</li>
        <li>Créer un album photo et un dossier Google Drive associé sur votre compte Google Drive.</li>
        <li>Permettre à d'autres utilisateurs, avec qui vous partagez l'album, d'ajouter des photos dans ce dossier Google Drive.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Partage des données :</h2>
      <p className="mb-4">
        Nous ne partageons aucune donnée personnelle avec des tiers. Les données sont partagées uniquement avec l'utilisateur et les personnes à qui il a accordé l'accès à ses albums.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Sécurité des données :</h2>
      <p className="mb-4">
        Nous nous engageons à protéger vos informations personnelles à travers des mesures de sécurité techniques et organisationnelles adéquates.
      </p>

      <p className="mt-6">
        Pour toute question concernant notre politique de confidentialité, veuillez nous contacter à <strong>lucaslhomme01@gmail.com</strong>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
