import { useState } from 'react';
import Auth from './components/auth/Auth';
import UserConfig from './components/user/UserConfig';
import Nutricion from './components/sections/Nutricion';
import Informacion from './components/sections/Informacion';
import HomeHero from './components/sections/HomeHero';

import Header from './components/layout/Header';
import './styles/global.css';
import { UserProvider } from "./context/UserContext";

function App() {
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [cerrandoAuth, setCerrandoAuth] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [cerrandoConfig, setCerrandoConfig] = useState(false);

  const cerrarAuthConAnimacion = () => {
    setCerrandoAuth(true);
    setTimeout(() => {
      setMostrarAuth(false);
      setCerrandoAuth(false);
    }, 250);
  };

  const cerrarConfigConAnimacion = () => {
    setCerrandoConfig(true);
    setTimeout(() => {
      setMostrarConfig(false);
      setCerrandoConfig(false);
    }, 250);
  };

  return (
    <UserProvider>
      <>
        {!mostrarAuth && !mostrarConfig && (
          <Header
            onMostrarAuth={() => setMostrarAuth(true)}
            onMostrarConfig={() => setMostrarConfig(true)}
          />
        )}

        <HomeHero />

        <div className="scroll-smooth min-h-screen">
          <Nutricion />
          <Informacion />
        </div>

        {mostrarAuth && (
          <div className="fixed inset-0 fondologin flex justify-center items-center z-50">

            <div className={cerrandoAuth ? "modal-anim-out" : "modal-anim-in"}>
              <Auth closeModal={cerrarAuthConAnimacion} />
            </div>

            <button
              className="absolute top-5 right-5 text-stone-800 text-3xl hover:scale-110 transition"
              onClick={cerrarAuthConAnimacion}
            >
              ✕
            </button>
          </div>
        )}

        {mostrarConfig && (
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">

            <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto ${cerrandoConfig ? "modal-anim-out" : "modal-anim-in"}`}>
              <UserConfig />
            </div>

            <button
              className="absolute top-5 right-5 text-white text-3xl hover:scale-110 transition"
              onClick={cerrarConfigConAnimacion}
            >
              ✕
            </button>
          </div>
        )}
      </>
    </UserProvider>
  );
}

export default App;