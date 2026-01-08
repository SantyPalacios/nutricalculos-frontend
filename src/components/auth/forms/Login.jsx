import { useState, useContext } from 'react';
import { UserContext } from "../../../context/UserContext";
import { API_URL } from '../../../config/api';

export default function Login({ onSwitchToSignup, closeModal }) {
    const { setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');


    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: contrasena }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Guardar token
            localStorage.setItem('token', data.token);

            // Guardar usuario en el contexto
            setUser({ ...data.user, token: data.token });

            // Cerrar modal
            closeModal();

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="w-96 p-6 rounded-2xl shadow-xl bg-amber-400 backdrop-blur-md border border-white/20">
            <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
            <form onSubmit={manejarEnvio} className="space-y-4">

                <input
                    type="email"
                    placeholder="Correo"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="input input-bordered w-full"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button type="submit" className="btn btn-primary w-full">
                    Iniciar sesión
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                ¿No tenés cuenta?
                <a className="link link-primary" onClick={onSwitchToSignup}>
                    Crear cuenta
                </a>
            </p>
        </div>
    );
}
