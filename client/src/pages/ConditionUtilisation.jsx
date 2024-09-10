import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Conditions d'Utilisation de ShareAlbum</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p className="mb-4">
        Bienvenue sur <strong>ShareAlbum</strong>. En utilisant notre application, vous acceptez les présentes Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Description du Service</h2>
      <p className="mb-4">
        <strong>ShareAlbum</strong> permet aux utilisateurs de créer un compte, de gérer des albums photo, et de stocker des photos dans leur Google Drive. L'application utilise les informations de votre compte Google pour fournir ces services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Création de Compte</h2>
      <p className="mb-4">
        Pour utiliser notre application, vous devez créer un compte en vous connectant via votre compte Google. Vous acceptez de fournir des informations précises et à jour lors de l'inscription.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Utilisation de l'Application</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Création d'Albums : Vous pouvez créer des albums photo et les associer à un dossier Google Drive.</li>
        <li>Partage : Vous pouvez partager des albums avec d'autres utilisateurs, leur permettant d'ajouter des photos.</li>
        <li>Responsabilité : Vous êtes responsable des photos que vous ajoutez et partagez.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Propriété Intellectuelle</h2>
      <p className="mb-4">
        Tous les droits de propriété intellectuelle relatifs à l'application et à son contenu (y compris, mais sans s'y limiter, les logos, graphiques, et textes) sont la propriété de <strong>ShareAlbum</strong> ou de ses concédants de licence.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation de Responsabilité</h2>
      <p className="mb-4">
        <strong>ShareAlbum</strong> ne sera pas responsable des dommages indirects, accessoires, spéciaux, ou conséquents résultant de l'utilisation ou de l'incapacité d'utiliser l'application.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Modification des Conditions</h2>
      <p className="mb-4">
        Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Les modifications seront publiées sur cette page et prendront effet dès leur publication.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
      <p>
        Pour toute question concernant ces conditions, veuillez nous contacter à <strong>lucaslhomme01@gmail.com</strong>.
      </p>
    </div>
  );
}

export default TermsOfUse;
