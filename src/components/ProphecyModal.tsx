import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Zap } from "lucide-react";

interface IProphecyModalProps {
    isOpen: boolean;
    prophecies: string[];
    secondsLeft: number;
    onSelect: (prophecy: string) => void;
}

const ProphecyModal: React.FC<IProphecyModalProps> = ({ isOpen, prophecies, secondsLeft, onSelect }) => {
    const isPortalFading = 5 < secondsLeft && secondsLeft <= 10;
    const isPortalClosing = secondsLeft <= 5;

    const [selectedProphecy, setSelectedProphecy] = useState<string | null>(null);

    const handleSelection = (word: string) => {
        if (selectedProphecy) return;

        setSelectedProphecy(word);
        onSelect(word);
    };

    useEffect(() => {
        if (isOpen && secondsLeft <= 3 && !selectedProphecy) {
            const randomIndex = Math.floor(Math.random() * prophecies.length);

            console.log("sketchbee-log: Auto selecting prophecy:", prophecies[randomIndex]);
            handleSelection(prophecies[randomIndex]);
        }

        if (!isOpen) setSelectedProphecy(null);
    }, [isOpen, secondsLeft, prophecies, selectedProphecy]);

    if (!isOpen || !prophecies || prophecies.length === 0) return null;
    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-700
            ${isPortalClosing ? "bg-red-500/5 backdrop-blur-3xl" : "bg-white/10 backdrop-blur-2xl"}`}
        >
            <div className="w-full max-w-4xl p-8 flex flex-col items-center gap-10 relative z-10 ">
                <div className="flex flex-col items-center space-y-6 text-center ">
                    <div
                        className={`flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all duration-500
                        ${
                            isPortalClosing
                                ? "bg-red-600 border-red-500 text-white shadow-lg animate-pulse scale-105"
                                : isPortalFading
                                ? "bg-amber-100 border-amber-300 text-amber-700"
                                : "bg-stone-900 border-stone-800 text-stone-100"
                        }`}
                    >
                        {isPortalClosing ? (
                            <Zap className="w-3.5 h-3.5 fill-current" />
                        ) : isPortalFading ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                            <Clock className="w-3.5 h-3.5" />
                        )}
                        <span className="font-mono text-[10px] font-bold tracking-[0.25em]">
                            {isPortalClosing ? "PORTAL CLOSING" : isPortalFading ? "PORTAL FADING" : "PORTAL STABLE"}
                            {" • "}
                            00:{secondsLeft.toString().padStart(2, "0")}
                        </span>
                    </div>

                    <div className="space-y-2 text-center">
                        <h2
                            className={`font-mono text-2xl md:text-3xl uppercase tracking-widest transition-colors duration-500 
                            ${isPortalClosing ? "text-red-800" : "text-slate-900"}`}
                        >
                            {selectedProphecy ? "Word Selected" : isPortalClosing ? "The portal is closing..." : "Select a word..."}
                        </h2>
                        {isPortalClosing && !selectedProphecy && <p className="text-sm font-mono text-red-700 animate-bounce">Auto selecting...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                    {prophecies.map((word, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => handleSelection(word)}
                                disabled={selectedProphecy !== null}
                                className={`group relative flex flex-col items-center justify-center py-12 px-6
                                    rounded-xl transition-all duration-500 transform
                                    bg-slate-200/50 border-slate-200/60 hover:bg-slate-50 hover:border-slate-900 hover:-translate-y-1
                                    ${isPortalClosing && !selectedProphecy ? "animate-pulse border-red-200" : "border"}
                                `}
                            >
                                <span className={"absolute top-4 left-4 font-mono text-[9px] text-slate-400 transition-colors group-hover:text-slate-900"}>0{index + 1}</span>

                                <span className={"font-mono text-xl text-slate-700 uppercase tracking-widest group-hover:text-slate-900 transition-colors"}>{word}</span>

                                <div className={"absolute bottom-6 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}>
                                    <span className={"font-mono font-bold text-[8px] uppercase tracking-[0.2em] text-slate-400 transition-colors"}>Lock this word</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center gap-3 opacity-40">
                    <div className={`h-px transition-all duration-1000 ${isPortalClosing ? "w-48 bg-red-600" : "w-12 bg-slate-900"}`} />

                    <span className="font-mono font-medium text-[9px] uppercase tracking-[0.5em] text-slate-900">
                        {selectedProphecy ? "Word selected" : `Portal Status: ${isPortalClosing ? "Critical" : isPortalFading ? "Fading" : "Optimal"}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProphecyModal;
