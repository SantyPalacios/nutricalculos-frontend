import { useState } from 'react';
import Login from './forms/Login';
import Register from './forms/Register';

export default function Auth({ closeModal }) {
    const [esInicioSesion, setEsInicioSesion] = useState(true);

    return (
        <>
            {esInicioSesion ? (
                <Login
                    onSwitchToSignup={() => setEsInicioSesion(false)}
                    closeModal={closeModal}
                />
            ) : (
                <Register
                    onSwitchToLogin={() => setEsInicioSesion(true)}
                    closeModal={closeModal}
                />
            )}
        </>
    );
}
