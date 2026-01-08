import { motion, useMotionValue, useTransform } from "framer-motion";

export default function HomeHero() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(((event.clientX - centerX) / (rect.width / 2)) * 100);
        y.set(((event.clientY - centerY) / (rect.height / 2)) * 100);
    }

    return (
        <div
            id="inicio"
            className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50"
            onMouseMove={handleMouseMove}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* SPOTLIGHT CONTAINER */}
            <div className="relative z-10 text-center" style={{ perspective: "1000px" }}>
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="inline-block"
                >
                    <h1 className="text-[6em] font-bold text-stone-800 select-none leading-tight tracking-tight shadow-xl rounded-xl px-10 py-4 bg-gradient-to-br from-amber-200 to-amber-400 backdrop-blur-sm border border-white/20">
                        NutriCálculos
                    </h1>
                </motion.div>

                <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl mx-auto text-lg text-stone-600 font-medium px-4 mt-8 leading-relaxed"
                >
                    "Conocer tu cuerpo es el primer paso para transformarlo. Utiliza nuestras herramientas inteligentes para calcular tu Índice de Masa Corporal (IMC) y Requerimiento Energético Diario (RED) con precisión. Define tus metas con datos reales."
                </motion.h4>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2 text-stone-400"
                >
                    <span className="text-sm">Desliza para calcular</span>
                    <div className="w-6 h-10 border-2 border-stone-300 rounded-full mx-auto mt-2 flex justify-center p-1">
                        <div className="w-1 h-3 bg-stone-400 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
