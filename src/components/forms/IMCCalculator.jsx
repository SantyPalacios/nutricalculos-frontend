import { useContext, useEffect, useState, useRef } from "react";
import SaveConfirmationModal from "../common/SaveConfirmationModal";
import { UserContext } from "../../context/UserContext";
import { API_URL } from "../../config/api";

export default function IMCCalculator({ peso, setPeso, altura, setAltura, onContinue, showContinue, onCalculated }) {
    const { user, setUser } = useContext(UserContext);
    const [resultadoimc, setResultadoimc] = useState("");
    const datosYaCargados = useRef(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [calcData, setCalcData] = useState(null); // { peso, altura, imc }

    // --- AUTOCOMPLETAR DATOS CUANDO EL USUARIO SE LOGUEA ---
    useEffect(() => {
        // Si hay usuario, tiene datos guardados, y aún no los hemos cargado
        if (user && user.peso && user.altura && !datosYaCargados.current) {
            setPeso(user.peso);
            setAltura(user.altura);
            datosYaCargados.current = true;
        }

        // Si el usuario cierra sesión, resetear el flag
        if (!user) {
            datosYaCargados.current = false;
        }
    }, [user, setPeso, setAltura]);

    // --- GUARDAR IMC ---
    async function guardarDatos(pesoNum, alturaNum, imcValor) {
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify({
                    peso: pesoNum,
                    altura: alturaNum,
                    imc: imcValor
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // alert("Datos guardados correctamente ✔"); // Replaced by UI feedback
            setResultadoimc(prev => prev + " - Guardado ✔");

            setUser(prev => ({
                ...prev,
                peso: pesoNum,
                altura: alturaNum,
                imc: imcValor
            }));

        } catch (err) {
            alert("Error al guardar: " + err.message);
        }
    }

    function calcularIMC() {
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (isNaN(pesoNum) || isNaN(alturaNum) || alturaNum <= 0) {
            setResultadoimc("Por favor, introduce valores válidos.");
            return;
        }

        const imcValor = pesoNum / (alturaNum * alturaNum);

        let categoria = "";
        if (imcValor < 18.5) categoria = "No estás entre los límites adecuados <18.5 a 24.9> pero puedes seguir con el RED si lo deseas";
        else if (imcValor < 25) categoria = "Podés seguir con el RED";
        else categoria = "No estás entre los límites adecuados <18.5 a 24.9> pero puedes seguir con el RED si lo deseas";

        setResultadoimc(`Tu IMC es ${imcValor.toFixed(2)} (${categoria})`);

        if (onCalculated) onCalculated();

        // NO GUARDAR SI NO CAMBIÓ NADA
        const noCambioNada =
            user &&
            pesoNum === user.peso &&
            alturaNum === user.altura &&
            imcValor.toFixed(2) === user.imc?.toFixed?.(2);

        if (user && noCambioNada) return;

        // Pregunta si quiere guardar
        if (user) {
            setCalcData({ peso: pesoNum, altura: alturaNum, imc: imcValor });
            setShowSaveModal(true);
        }
    }

    return (
        <div className="w-full p-5" style={{ textAlign: "center" }}>
            <h3 className="sombreado">Calcula tu IMC</h3>
            <br />
            <h4>Calcula tu índice corporal base.</h4>
            <br />
            <label className="sombreado">Peso (kg): </label>
            <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="border border-stone-300 rounded-4xl px-3 mr-2"
                style={{ width: "80px" }}
            />

            <label className="sombreado">Altura (m): </label>
            <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="border border-stone-300 rounded-4xl px-3"
                style={{ width: "80px" }}
            />
            <br />

            <div className="min-h-[160px] flex flex-col items-center mt-4 space-y-3 justify-start">
                <button
                    onClick={calcularIMC}
                    className="px-8 py-2 bg-amber-400 text-white rounded-full hover:bg-amber-600 transition font-medium shadow-sm hover:shadow-md"
                >
                    Calcular
                </button>

                <div className="h-8 flex items-center justify-center">
                    <p className={`sombreado transition-opacity duration-300 ${resultadoimc ? 'opacity-100' : 'opacity-0'}`}>
                        {resultadoimc}
                    </p>
                </div>

                <div className={`h-10 transition-all duration-500 transform ${showContinue ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {showContinue && (
                        <button
                            onClick={onContinue}
                            className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition font-medium text-sm"
                        >
                            Continuar →
                        </button>
                    )}
                </div>
            </div>


            <SaveConfirmationModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={() => {
                    if (calcData) guardarDatos(calcData.peso, calcData.altura, calcData.imc);
                }}
                title={user?.imc ? "Actualizar Datos" : "Guardar Datos"}
                message={user?.imc
                    ? "¿Querés actualizar tus datos?"
                    : "¿Querés guardar tus datos? Así la próxima vez se cargarán automáticamente."}
            />
        </div >
    );
}
