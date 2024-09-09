import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import googleLogo from '../pictures/google_logo.png';

function Login() {
  const { whereGo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const HomeId = searchParams.get('id')
  let loginUrl;
  if(HomeId){
    console.log('toto')
    loginUrl = `${process.env.REACT_APP_API_URL}/getAuth2GoogleUrl/${whereGo}?id=${HomeId}`;
  } else {
    loginUrl = `${process.env.REACT_APP_API_URL}/getAuth2GoogleUrl/${whereGo}`;
  }

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-5 rounded shadow-md text-center flex flex-col space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        <a href={loginUrl} className='inline bg-gray-200 p-2s w-12/12 rounded '>
          <div className='flex items-center justify-center space-x-4 p-2  '>
            <h1 className="text-lg">Signup or signin with </h1>
            <img className="h-6 w-auto" src={googleLogo} alt="Google logo" />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Login;
