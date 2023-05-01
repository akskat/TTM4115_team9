import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkTokenValidity } from '../../services/api'; // assuming you have an api function to check the token validity

const PrivateRoute = () => {
    const [isLoading, setLoading] = useState(true);
    const [isValid, setValidity] = useState(false);

    useEffect(() => {
        async function validateToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const isValidToken = await checkTokenValidity(token); // make sure to handle errors, this is just an example
                setValidity(isValidToken);
            }
            setLoading(false);
        }
        validateToken();
    }, []);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return isValid ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
