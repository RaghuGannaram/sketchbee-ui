import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ActivePlayersList from "../components/ActivePlayersList";
import DrawingCanvas from "../components/DrawingCanvas";
import ChatWindow from "../components/ChatWindow";
import BrushControls from "../components/BrushControls";

const Game: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col px-12 py-2 bg-linear-to-br from-yellow-100 via-amber-50 to-orange-100 overflow-hidden">
            <nav className="h-16 flex justify-between items-center">
                <span className="flex items-center gap-2 text-yellow-700 font-semibold text-lg">
                    <button
                        onClick={() => navigate("/")}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-yellow-50 transition-all"
                    >
                        <ArrowLeft className="text-yellow-600 w-5 h-5" />
                    </button>
                    Back
                </span>
                <span>Omi</span>
            </nav>

            <div className="flex-1 grid gap-4 grid-cols-1 grid-rows-[auto_auto_auto_auto] sm:grid-cols-[minmax(180px,1fr)_minmax(500px,3fr)_minmax(250px,1fr)] sm:grid-rows-1 ">
                <div className="sm:col-span-1 order-1 sm:order-0">
                    <ActivePlayersList />
                </div>

                <div className="sm:col-span-1 order-2 sm:order-0 rounded-xl shadow-lg border border-yellow-200 ">
                    <DrawingCanvas />
                </div>

                <div className="sm:col-span-1 order-3 sm:order-0">
                    <ChatWindow />
                </div>
            </div>

            <div className="h-32">
                <BrushControls />
            </div>
        </div>
    );
};

export default Game;
