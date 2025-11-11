import React from "react";
import ActivePlayersList from "../components/ActivePlayersList";
import DrawingCanvas from "../components/DrawingCanvas";
import ChatWindow from "../components/ChatWindow";
import BrushControls from "../components/BrushControls";

const Game: React.FC = () => {
    return (
        <div className="min-h-screen w-full p-10 grid grid-cols-1 grid-rows-[auto_auto_auto_auto] sm:grid-cols-[1fr_3fr_1fr] sm:grid-rows-[4fr_1fr] bg-linear-to-br from-yellow-100 via-amber-50 to-orange-100 overflow-hidden">
            <div className="sm:col-span-1 order-1 sm:order-0">
                <ActivePlayersList />
            </div>

            <div className="sm:col-span-1 order-2 sm:order-0 p-2">
                <DrawingCanvas />
            </div>

            <div className="sm:col-span-1 order-3 sm:order-0 ">
                <ChatWindow />
            </div>

            <div className="col-span-1 sm:col-span-3 order-4 sm:order-0">
                <BrushControls />
            </div>
        </div>
    );
};

export default Game;
