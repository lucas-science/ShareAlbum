import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';  // Importer la librairie QRCode
import jsPDF from 'jspdf';  // Importer jsPDF
import Cookies from 'js-cookie';

const MyHome = () => {
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get('id');
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null); // Référence pour l'input de fichier
  const [showQR, setShowQR] = useState(false);  // État pour afficher ou cacher le pop-up QR
  const sessionToken = Cookies.get('sessionToken')

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getPhoto/${albumId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des photos');
      }

      const data = await response.json();
      setPhotos(data.files);
    } catch (err) {
      console.error('Erreur :', err);
      setError('Impossible de récupérer les photos.');
    }
  };

  const fetchAlbumInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getAlbumInfos/${albumId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de l\'album');
      }

      const data = await response.json();
      setAlbumName(data.albumName);
    } catch (err) {
      console.error('Erreur :', err);
      setError('Impossible de récupérer les informations de l\'album.');
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumInfo();
      fetchPhotos();
    }
  }, [albumId]);

  const handleAddPhoto = async (event) => {
    const selectedFile = event.target.files[0]; // Récupérer le fichier sélectionné
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('albumId', albumId);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/sendPhoto`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionToken,
        },
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la photo.');
      }
      fetchPhotos();
    } catch (err) {
      console.error('Erreur :', err);
      setError('Impossible d\'envoyer la photo.');
    }
  };

  const triggerFileSelect = () => {
    navigate(`/myHome/takePicture?id=${albumId}`)
  };

  // Générer le PDF contenant le QRCode
  const generatePDF = () => {
    const doc = new jsPDF();
    const qrCanvas = document.getElementById('qrCode');
    const qrImage = qrCanvas.toDataURL('image/png');
    doc.text(`Rejoignez l'album photo ${albumName} en scannant le QR code suivant :`, 10, 10);
    doc.addImage(qrImage, 'PNG', 10, 20, 150, 150);
    doc.save(`QRCode_Album_${albumName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      
      {/* Section contenant le titre et le bouton "Partager" */}
      <div className="w-2/3 md:w-1/3 max-w-5xl flex justify-between   items-center px-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{albumName}</h1>
        <button
          onClick={() => setShowQR(true)}
          className="bg-green-500 text-white text-lg py-3 px-6 rounded-lg shadow-lg"
        >
          Partager
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/image-proxy?id=${photo.id}`}
                alt={photo.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-gray-800 font-semibold">{photo.name}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucune photo disponible dans cet album.</p>
      )}

      {/* Bouton pour ajouter une photo */}
      <button
        onClick={triggerFileSelect}
        className="bg-blue-500 text-white text-lg py-3 px-6 rounded-lg shadow-lg fixed bottom-6"
      >
        Ajouter une photo
      </button>

      {/* Pop-up QR code */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Fermer
            </button>
            <h2 className="text-xl font-bold mb-4">Partager l'album</h2>
            <QRCodeCanvas id="qrCode" value={window.location.href} size={256} />
            <button
              onClick={generatePDF}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Télécharger le QR code en PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHome;
