import React from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { motion } from "framer-motion";

const Home: React.FC = () => {
    const [handle, setHandle] = useLocalStorage("sketchbee:handle", "");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setHandle(handle.trim());

        if (handle.trim()) {
            navigate("/game");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-yellow-100 via-amber-50 to-orange-100 relative overflow-hidden">
            <motion.h1
                className="text-5xl md:text-6xl font-extrabold text-yellow-600 mb-8 sm:mb-4 z-10 drop-shadow-lg text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Welcome to <span className="text-orange-500">SketchBee</span>
            </motion.h1>

            <p className="text-gray-700 text-lg mb-6 z-10">Draw. Guess. Laugh. Repeat.</p>

            <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <input
                    type="text"
                    placeholder="Enter your funny handle..."
                    value={handle}
                    onChange={(event) => setHandle(event.target.value)}
                    className="px-4 py-2 w-64 sm:w-72 rounded-lg border border-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-700 text-lg shadow-sm"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95"
                >
                    Join Game
                </button>
            </motion.form>

            <p className="text-sm text-gray-500 mt-10 z-10">Ready to unleash your inner Picasso? 🎨🐝</p>
        </div>
    );
};

export default Home;
