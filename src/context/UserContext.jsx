import { createContext, useEffect, useState } from "react";
import { API_URL } from "../config/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // Guardamos SOLO el token hasta que pidamos /me
            setUser({ token });
            cargarUsuario(token);
        }
    }, []);

    async function cargarUsuario(token) {
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: {
                    "Authorization": "Bearer " + token,
                },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // Guardamos toda la info + el token
            setUser({ ...data, token });

        } catch (err) {
            console.log("Token inválido → cerrando sesión");
            localStorage.removeItem("token");
            setUser(null);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
