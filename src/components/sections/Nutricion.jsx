import { useState, useContext, useEffect, useRef } from "react";
import IMCCalculator from "../forms/IMCCalculator";
import REDCalculator from "../forms/REDCalculator";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";

function Nutricion() {
    const { user } = useContext(UserContext);
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const datosYaCargados = useRef(false);
    const [step, setStep] = useState(1); // 1 = IMC, 2 = RED
    const [imcCalculado, setImcCalculado] = useState(false);


    // Autocompletar peso y altura cuando el usuario se loguea
    useEffect(() => {
        if (user && !datosYaCargados.current) {
            // Cargar datos si existen
            if (user.peso) setPeso(user.peso);
            if (user.altura) setAltura(user.altura);
            datosYaCargados.current = true;
        }

        if (!user) {
            datosYaCargados.current = false;
        }
    }, [user]);

    return (
        <>
            <div className="w-full bg-stone-50">
                {/* CALCULATORS WORKSPACE */}
                <div id="calculadoras" className="min-h-screen flex flex-col justify-center items-center py-20 bg-stone-100/50">
                    <h2 className="text-3xl font-bold text-stone-800 mb-12">Tu Espacio de Trabajo</h2>

                    {/* Main Container */}
                    <motion.div
                        layout
                        className="flex w-full justify-center items-start gap-16 px-4 max-w-[95rem] mx-auto"
                    >
                        {/* IMC Calculator */}
                        <motion.div
                            layout
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Smooth spring-like ease
                            className="w-full max-w-lg relative z-20"
                        >
                            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                <IMCCalculator
                                    onCalculated={() => setImcCalculado(true)}
                                    showContinue={imcCalculado}
                                    onContinue={() => setStep(2)}
                                    peso={peso} setPeso={setPeso} altura={altura} setAltura={setAltura}
                                />
                            </div>
                        </motion.div>

                        {/* RED Calculator - Slides in */}
                        <AnimatePresence mode="popLayout">
                            {step === 2 && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative z-10 overflow-visible"
                                >
                                    <div className="w-[36rem] p-8 -m-8">
                                        <motion.div
                                            initial={{ x: "100%" }}
                                            animate={{ x: 0 }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="w-full bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                                        >
                                            <REDCalculator peso={peso} setPeso={setPeso} altura={altura} setAltura={setAltura} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* DASHBOARD PREVIEW / FUTURE SECTION */}


            </div>
        </>
    );
}

export default Nutricion;