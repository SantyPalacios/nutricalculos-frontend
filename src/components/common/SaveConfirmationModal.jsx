import { motion, AnimatePresence } from "framer-motion";

export default function SaveConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-stone-100 overflow-hidden"
                    >
                        {/* Decorative header line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
                            <p className="text-stone-600 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="flex justify-around gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-full text-stone-600 hover:bg-stone-100 transition font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-5 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition font-medium text-sm shadow-md hover:shadow-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
