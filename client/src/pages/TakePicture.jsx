import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function TakePicture() {
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get('id');
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' = caméra avant, 'environment' = caméra arrière
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null); // Etat pour gérer les erreurs
  const sessionToken = Cookies.get('sessionToken')


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const videoConstraints = {
        video: {
          facingMode: facingMode, // caméra avant ou arrière
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra :', error);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/png');
      setPhoto(photoData);

      // Envoyer la photo au serveur
      sendPhotoToServer(photoData);
    }
  };

  const sendPhotoToServer = async (photoData) => {
    // Convertir la base64 en Blob
    const blob = await (await fetch(photoData)).blob();
    const formData = new FormData();

    const randomFileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
    formData.append('photo', blob, randomFileName); // nom du fichier et format PNG
    formData.append('albumId', albumId); // ID de l'album

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/sendPhoto`, {
        method: 'POST',
        headers: {
          'x-access-token': sessionToken,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Photo envoyée avec succès :', result);
        navigate(`/myHome?id=${albumId}`); // Redirection vers la page avec l'ID de l'album
      } else {
        const result = await response.json();
        console.error('Erreur lors de l\'envoi de la photo :', result.message);
        setError('Erreur lors de l\'envoi de la photo. Veuillez réessayer.'); // Afficher le message d'erreur
      }
    } catch (error) {
      console.error('Erreur de requête :', error);
      setError('Erreur lors de l\'envoi de la photo. Veuillez réessayer.'); // Afficher le message d'erreur
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-xl font-bold mb-4">Prendre une photo</h1>

      {photo ? (
        <img src={photo} alt="Captured" className="w-full max-w-md" />
      ) : (
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md bg-black rounded-lg" />
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="space-y-2">
        {!photo && (
          <>
            <button
              onClick={takePhoto}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Prendre une photo
            </button>
            {isMobile && (
              <button
                onClick={switchCamera}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                {facingMode === 'user' ? 'Utiliser la caméra arrière' : 'Utiliser la caméra avant'}
              </button>
            )}
          </>
        )}
        {error && (
          <div className="text-red-500 mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}

export default TakePicture;
