import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Wand2, AlertCircle } from "lucide-react";
import useSocket from "../hooks/useSocket";
import useSeer from "../hooks/useSeer";

const Atrium: React.FC = () => {
    const navigate = useNavigate();

    const epithet = useSeer((state) => state.epithet);
    const incarnate = useSeer((state) => state.incarnate);
    const { emit } = useSocket();

    const [neoEpithet, setNeoEpithet] = useState(epithet ?? "");
    const [errorMessage, setErrorMessage] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        emit("sys:greet", { greeting: "Hello server..!" }, (response: { greeting: string; timestamp: number }) => {
            console.log(`sketchbee-log: server greeted at ${new Date(response.timestamp)}`);
        });
    }, [emit]);

    const triggerError = (msg: string) => {
        setErrorMessage(msg);
        setIsShaking(true);

        setTimeout(() => {
            setIsShaking(false);
        }, 500);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = neoEpithet.trim();

        if (!trimmed) {
            triggerError("A name is required to proceed.");
        } else if (trimmed.length < 3) {
            triggerError("Your nickname is a bit too short (min 3).");
        } else if (trimmed.length > 15) {
            triggerError("That name is too long (max 15).");
        } else {
            incarnate(trimmed);
            navigate("/sanctum");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 via-indigo-50/50 to-slate-100 relative overflow-hidden font-serif select-none">
            <div className="relative flex flex-col items-center mb-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4 p-3 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-indigo-50"
                >
                    <Wand2 className="w-8 h-8 text-indigo-600 stroke-[1.5px]" />
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Sketch<span className="text-indigo-600">Bee</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 px-4 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-full"
                >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <p className="text-[10px] font-mono font-black text-indigo-900 uppercase tracking-[0.4em]">Every stroke tells a story</p>
                </motion.div>
            </div>

            <motion.form
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4 w-full max-w-md px-6"
                onSubmit={handleSubmit}
            >
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-5 z-20 flex items-center pointer-events-none">
                        <User className={`w-4 h-4 transition-colors ${errorMessage ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"}`} />
                    </div>
                    <input
                        type="text"
                        placeholder="What should we call you?"
                        value={neoEpithet}
                        className={`w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl border transition-all shadow-sm text-lg outline-none
                            ${
                                errorMessage
                                    ? "border-red-200 ring-4 ring-red-500/5 text-red-900"
                                    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 text-slate-800"
                            }`}
                        onChange={(event) => {
                            setNeoEpithet(event.target.value);
                            if (errorMessage) {
                                setErrorMessage("");
                            }
                        }}
                    />
                </div>

                <div className="h-5 w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="flex items-center justify-center gap-2 text-rose-500/90"
                            >
                                <AlertCircle className="w-2 h-2" />
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase leading-none">{errorMessage}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="submit"
                    className="group relative w-full overflow-hidden px-8 py-4 bg-slate-900 text-white font-mono font-bold text-sm uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span className="relative z-10">Start Sketching</span>
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
            </motion.form>

            <motion.div className="mt-16 flex flex-col items-center gap-4 opacity-40" initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.8 }}>
                <div className="h-px w-12 bg-slate-900" />
                <p className="font-mono text-[9px] text-slate-900 uppercase tracking-[0.5em] leading-loose max-w-[300px] text-center">Sketch • Guess • Score</p>
            </motion.div>
        </div>
    );
};

export default Atrium;
