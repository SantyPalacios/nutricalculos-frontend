import { useContext, useEffect, useState, useRef } from "react";
import SaveConfirmationModal from "../common/SaveConfirmationModal";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config/api";

const actividadFactor = {
    "Sedentario": 1.3,
    "Poco Activo": 1.5,
    "Activo": 1.75,
    "Muy Activo": 2.0
};

export default function REDCalculator({ peso, setPeso, altura, setAltura }) {
    const { user, setUser } = useContext(UserContext);

    const [sexo, setSexo] = useState("hombre");
    const [edad, setEdad] = useState("");
    const [actividad, setActividad] = useState("Poco Activo");
    const [resultado, setResultado] = useState("");
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [direction, setDirection] = useState(0);
    const datosYaCargados = useRef(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [calcData, setCalcData] = useState(null);

    const activitiesOrder = ["Sedentario", "Pocoactivo", "Activo", "Muyactivo"];

    // --- AUTOCOMPLETAR DATOS CUANDO EL USUARIO SE LOGUEA ---
    useEffect(() => {
        // Si hay usuario con datos guardados y aún no los hemos cargado
        if (user && !datosYaCargados.current) {
            if (user.peso) setPeso(user.peso);
            if (user.altura) setAltura(user.altura);
            if (user.sexo) setSexo(user.sexo);
            if (user.edad) setEdad(user.edad);
            if (user.actividad) setActividad(user.actividad);
            datosYaCargados.current = true;
        }

        // Si el usuario cierra sesión, resetear el flag
        if (!user) {
            datosYaCargados.current = false;
        }
    }, [user, setPeso, setAltura]);

    function redondearPersonalizado(num) {
        const centenas = Math.floor(num / 100) * 100;
        const resto = num - centenas;

        if (resto < 25) return centenas;
        if (resto < 75) return centenas + 50;
        return centenas + 100;
    }

    async function guardarRED(REDredondeado) {

        try {
            const res = await fetch(`${API_URL}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify({
                    sexo,
                    edad: parseInt(edad),
                    actividad,
                    red: REDredondeado
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // alert("Datos guardados correctamente ✔");
            setResultado(prev => prev + " - Guardado ✔");

            setUser(prev => ({
                ...prev,
                sexo,
                edad: parseInt(edad),
                actividad,
                red: REDredondeado
            }));

        } catch (err) {
            alert("Error al guardar: " + err.message);
        }
    }

    function calcularRED() {
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura) * 100;
        const edadNum = parseInt(edad);

        if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(edadNum)) {
            setResultado("Por favor, completa todos los campos.");
            return;
        }

        const factor = actividadFactor[actividad];

        let GEB = sexo === "hombre"
            ? (10 * pesoNum) + (6.25 * alturaNum) - (5 * edadNum) + 5
            : (10 * pesoNum) + (6.25 * alturaNum) - (5 * edadNum) - 161;

        const RED = GEB * factor;
        const redondeado = redondearPersonalizado(RED);

        setResultado(`Tu requerimiento energético diario es de aproximadamente ${redondeado} kcal.`);

        // 🚫 NO guardar si no cambió nada
        const noCambioNada = user &&
            pesoNum === user.peso &&
            Math.abs(parseFloat(altura) - user.altura) < 0.01 &&
            sexo === user.sexo &&
            edadNum === user.edad &&
            actividad === user.actividad &&
            redondeado === user.red;

        if (user && noCambioNada) return;

        // Si hay cambios, preguntar
        if (user) {
            setCalcData({ red: redondeado });
            setShowSaveModal(true);
        }
    }

    const activityDescriptions = {
        Sedentario: "Si estas internado, postrado o algo por el estilo o si no tocas pasto ni de casualidad y con suerte te levantas para ir al baño lamento decirte que serias sedentario.",
        Pocoactivo: "Si estudias o trabajas sentado en lugares cerrados y soles realizar actividad física como caminar, andar en bicicleta o realizas deporte de 1 a 3 veces por semana serias ligero.",
        Activo: "Si tu trabajo es un poco mas movido (como transportar cosas, limpieza o similares) pero sigue siendo en lugares cerrados y soles realizar actividad física como caminar, andar en bicicleta o realizas deportes/actividad fisica de 3 a 5 veces por semana serias Activo.",
        Muyactivo: "Si tu trabajo tambien requiere bastante movimiento y a demas es en un lugar al aire libre (como deportista profesional o algo relacionado a la albañileria por ejemplo) y soles realizar actividad física como caminar, andar en bicicleta o realizas deportes/actividad fisica de 6 a 7 días por semana serias Muy Activo."
    };

    const activityLabels = {
        Sedentario: "Sedentario",
        Pocoactivo: "Poco Activo",
        Activo: "Activo",
        Muyactivo: "Muy Activo"
    };

    const handleActivityClick = (newActivity) => {
        const currentIndex = activitiesOrder.indexOf(selectedActivity);
        const newIndex = activitiesOrder.indexOf(newActivity);

        // If first selection or unselected, default to entering from right (1)
        if (currentIndex === -1) {
            setDirection(1);
        } else {
            setDirection(newIndex > currentIndex ? 1 : -1);
        }

        setSelectedActivity(newActivity);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="w-full p-5" style={{ textAlign: "center" }}>
            <h3 className="sombreado">Calculadora de RED</h3>
            <br />
            <h4>Descubre cuántas calorías necesitas realmente.</h4>
            <br />
            <div className="flex flex-wrap justify-center items-center gap-4 mb-2">
                {/* PESO */}
                <div className="flex items-center">
                    <label className="sombreado mr-2">Peso:</label>
                    <input
                        type="number"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        className="border border-stone-300 rounded-4xl px-3"
                        style={{ width: "80px" }}
                    />
                </div>

                {/* ALTURA */}
                <div className="flex items-center">
                    <label className="sombreado mr-2">Altura:</label>
                    <input
                        type="number"
                        value={altura ? parseFloat(altura) * 100 : ""}
                        onChange={(e) => setAltura(e.target.value / 100)}
                        className="border border-stone-300 rounded-4xl px-3"
                        style={{ width: "80px" }}
                    />
                </div>

                {/* SEXO */}
                <div className="flex items-center">
                    <label className="sombreado mr-2">Sexo:</label>
                    <select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        className="border border-stone-300 rounded-4xl px-3"
                    >
                        <option value="hombre">Hombre</option>
                        <option value="mujer">Mujer</option>
                    </select>
                </div>
            </div>
            <br />

            {/* EDAD */}
            <label className="sombreado">Edad (años):</label>
            <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                className="border border-stone-300 rounded-4xl px-3 ml-1"
                style={{ width: "80px" }}
            />


            {/* ACTIVIDAD */}
            <label className="sombreado">Actividad física:</label>
            <select
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="border border-stone-300 rounded-4xl px-3 ml-1"
            >
                <option value="Sedentario">Sedentario</option>
                <option value="Poco Activo">Poco Activo</option>
                <option value="Activo">Activo</option>
                <option value="Muy Activo">Muy Activo</option>
            </select>

            <br />

            <div className="flex items-center justify-center gap-2 mt-2 mb-4">
                <span className="text-sm text-stone-600">¿No sabes tu nivel de actividad?</span>
                <label
                    htmlFor="modal-activ"
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 border border-amber-200 cursor-pointer hover:bg-amber-200 transition font-bold text-xs"
                >
                    ?
                </label>
            </div>

            {/*  MODAL */}
            <input type="checkbox" id="modal-activ" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-white">
                    <h3 className="font-bold text-lg mb-4 border-2 border-stone-200 rounded-lg p-2 text-stone-800">
                        Elige tu nivel de actividad física
                    </h3>

                    <div className="flex gap-3 w-full text-stone-800">
                        {["Sedentario", "Pocoactivo", "Activo", "Muyactivo"].map((activity) => (
                            <label
                                key={activity}
                                className={`btn btn-outline border-stone-300 hover:border-amber-500 hover:bg-amber-100 hover:text-stone-900 w-50px justify-start ${selectedActivity === activity ? "bg-amber-500 text-white border-amber-500" : "text-stone-700"
                                    }`}
                                onClick={() => handleActivityClick(activity)}
                            >
                                {activityLabels[activity]}
                            </label>
                        ))}
                    </div>

                    <div className="mt-4 h-48 overflow-hidden relative">
                        <AnimatePresence mode="wait" custom={direction}>
                            {selectedActivity && (
                                <motion.div
                                    key={selectedActivity}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="text-sm border-2 rounded-lg p-2 text-stone-700 border-stone-200 absolute w-full top-0 left-0 bg-white"
                                >
                                    <p>{activityDescriptions[selectedActivity]}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="modal-action">
                        <label htmlFor="modal-activ" className="btn btn-ghost text-stone-600 hover:bg-stone-100">Cerrar</label>
                    </div>
                </div>
            </div>

            <button
                onClick={calcularRED}
                className="px-8 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition font-medium shadow-sm hover:shadow-md"
            >
                Calcular
            </button>

            <br />

            <p className="sombreado">{resultado}</p>

            <SaveConfirmationModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={() => {
                    if (calcData) guardarRED(calcData.red);
                }}
                title={user?.red ? "Actualizar Datos" : "Guardar Datos"}
                message={user?.red
                    ? "¿Querés actualizar tus datos?"
                    : "¿Querés guardar tus datos? Así la próxima vez se cargarán automáticamente."}
            />
        </div>
    );
}
