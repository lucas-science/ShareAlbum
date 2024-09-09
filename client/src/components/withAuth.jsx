import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
  return function AuthenticatedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [redirectTo, setRedirectTo] = useState('');
    const location = useLocation();
    

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
          } else {
            throw new Error('Invalid token');
          }
        })
        .catch(err => {
          console.error('Authentication failed:', err);
          setRedirect(true);
          if(location.search) { // si l'id est donné en query dans l'url
            setRedirectTo(`/login${location.pathname}${location.search}`);
            setLoading(false);
            return null
          }
          setRedirectTo(`/login${location.pathname}`);
          setLoading(false);
          return null
        });
    }, [location.pathname]);

    if (loading) return <div>Loading...</div>;
    if (redirect) return <Navigate to={redirectTo} />;
    return <ComponentToProtect {...props} />;
  };
}
