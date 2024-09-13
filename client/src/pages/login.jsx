import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import googleLogo from '../pictures/google_logo.png';

function Login() {
  const { whereGo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const HomeId = searchParams.get('id');
  let loginUrl;
  
  if (HomeId) {
    loginUrl = `${process.env.REACT_APP_API_URL}/getAuth2GoogleUrl/${whereGo}?id=${HomeId}`;
  } else {
    loginUrl = `${process.env.REACT_APP_API_URL}/getAuth2GoogleUrl/${whereGo}`;
  }

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = loginUrl;
    }, 500); 
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-fast"></div>
          <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-medium"></div>
          <div className="w-10 h-10 bg-blue-500 rounded-full animate-ping-slow"></div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded shadow-md text-center flex flex-col space-y-5">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
          <button onClick={handleLoginClick} className='inline bg-gray-200 p-2 w-full rounded'>
            <div className='flex items-center justify-center space-x-4 p-2'>
              <h1 className="text-lg">Signup or signin with </h1>
              <img className="h-6 w-auto" src={googleLogo} alt="Google logo" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
