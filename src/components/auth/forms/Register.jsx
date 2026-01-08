import { useState, useContext } from 'react';
import { UserContext } from "../../../context/UserContext";
import { API_URL } from '../../../config/api';

export default function Register({ onSwitchToLogin, closeModal }) {
    const { setUser } = useContext(UserContext);

    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');


    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const res = await fetch(`${API_URL}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usuario, email, password: contrasena }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Guardar token
            localStorage.setItem("token", data.token);

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
            <h2 className="text-2xl font-bold text-center">Registrarse</h2>
            <form onSubmit={manejarEnvio} className="space-y-4">

                <input
                    type="text"
                    placeholder="Usuario"
                    className="input input-bordered w-full"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                />

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
                    Registrarme
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                ¿Ya tenés cuenta?
                <a className="link link-primary" onClick={onSwitchToLogin}>
                    Ingresá acá
                </a>
            </p>
        </div>
    );
}
