import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const GetToken = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const redirectTo = params.get('redirectTo')
        const id = params.get('id');
        
        if (token) {
            Cookies.set('sessionToken', token, { secure: true, sameSite: 'None' });
            if (id) {
                console.log('ID reçu :', id);
                navigate(`/${redirectTo}?id=${id}`)
            }
            navigate(`/${redirectTo}`)
        } else {
            console.log("Pas de token trouvé")
            navigate('/404')
        }

    }, [location, navigate]);

    return (
        <div>
            GetToken page
        </div>
    );
};


export default GetToken;