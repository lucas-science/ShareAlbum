import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [HomeName, setHomeName] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  // Affiche le message d'erreur pendant 3 secondes
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const handleInputChange = (event) => {
    setHomeName(event.target.value);
  };

  const submit = (event) => {
    event.preventDefault();
    setInputDisabled(true);

    fetch(`${process.env.REACT_APP_API_URL}/createNewHomeAlbum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ HomeName }),
      credentials: 'include',
    })
    .then(async (response) => {
      if (!response.ok) {
        const jsonResponse = await response.json(); // Changer ici
        showErrorMessage(jsonResponse.message);
    
        setInputDisabled(false);
        return null;
      }
    
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        throw new Error('Invalid response format.');
      }
    })
    
    .then((data) => {
      if (data) {
        navigate(`/myHome?id=${data.newAlbumId}`);
      }
    })
    .catch((error) => {
      //showErrorMessage('An error occurred: ' + error.message);
      setInputDisabled(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {showError && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md">
          {errorMessage}
        </div>
      )}
      <form className='w-4/5 md:w-5/12 xl:w-3/12 flex' method="post" onSubmit={submit}>
        <input
          className='bg-white p-2 w-9/12 rounded-l'
          type='text'
          name='HomeName'
          placeholder='Your new Home Album ...'
          value={HomeName}
          onChange={handleInputChange}
          disabled={inputDisabled}
        />
        <input
          className='bg-blue-500 w-3/12 text-white p-2 rounded-r'
          type='submit'
          disabled={inputDisabled}
        />
      </form>
    </div>
  );
};

export default Create;
