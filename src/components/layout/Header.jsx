import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

export default function Header({ onMostrarAuth, onMostrarConfig }) {
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="navbar bg-amber-400 text-stone-800 px-6 fixed top-0 w-full z-50 shadow-sm">
            <div className="flex w-full items-center justify-between">

                {/* Desktop User Menu (Left) */}
                <div className="hidden lg:flex flex-1 justify-start relative">
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="font-semibold hover:text-amber-700 transition flex items-center gap-2"
                            >
                                Hola {user.username}!
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown User Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute top-full left-0 mt-4 w-48 bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-b-lg overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-stone-100 transition text-stone-700"
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            onMostrarConfig();
                                        }}
                                    >
                                        Configuración
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            logout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-stone-100 transition"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden ml-auto z-50">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="btn btn-ghost btn-circle text-stone-800"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown (Compact) */}
                <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl flex flex-col items-center py-6 space-y-4 transition-all duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
                    }`}>

                    <button
                        onClick={() => scrollToSection('inicio')}
                        className="text-lg font-medium text-stone-700 hover:text-amber-600 transition"
                    >
                        Inicio
                    </button>

                    <button
                        onClick={() => scrollToSection('calculadoras')}
                        className="text-lg font-medium text-stone-700 hover:text-amber-600 transition"
                    >
                        Calculadoras
                    </button>

                    <button
                        onClick={() => scrollToSection('informacion')}
                        className="text-lg font-medium text-stone-700 hover:text-amber-600 transition"
                    >
                        Información
                    </button>


                    {!user && (
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onMostrarAuth();
                            }}
                            className="text-sm border border-stone-800 text-stone-800 rounded-full px-6 py-2 hover:bg-stone-800 hover:text-white transition mt-2"
                        >
                            Iniciar Sesión
                        </button>
                    )}

                    {user && (
                        <>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onMostrarConfig();
                                }}
                                className="text-lg font-medium text-stone-700 hover:text-amber-600 transition"
                            >
                                Configuración
                            </button>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    logout();
                                }}
                                className="text-sm font-medium text-red-500 hover:text-red-400 transition mt-2"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>

                {/* Desktop Center Nav */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <ul className="menu menu-horizontal px-1">

                        <li><button onClick={() => scrollToSection('inicio')}>Inicio</button></li>
                        <li><button onClick={() => scrollToSection('calculadoras')}>Calculadoras</button></li>
                        <li><button onClick={() => scrollToSection('informacion')}>Información</button></li>


                        {!user && (
                            <li>
                                <button onClick={onMostrarAuth}>
                                    Iniciar Sesión / Registrate
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Spacer for centering logic (Desktop Right) */}
                <div className="hidden lg:flex flex-1 justify-end">
                </div>

            </div>
        </div>
    );
}
