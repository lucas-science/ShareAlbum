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
        const redirectTo = params.get('redirectTo');
        const id = params.get('id');

        console.log('Params:', { token, redirectTo, id }); // Ajout de logs

        if (token) {
            Cookies.set('sessionToken', token, { secure: true, sameSite: 'None' });
            const redirectPath = id ? `/${redirectTo}?id=${id}` : `/${redirectTo}`;
            console.log('Redirection vers :', redirectPath); // Ajout de logs
            navigate(redirectPath);
        } else {
            console.log("Pas de token trouvé");
            navigate('/404');
        }
    }, [location, navigate]);

    return (
        <div>
            GetToken page
        </div>
    );
};

export default GetToken;
