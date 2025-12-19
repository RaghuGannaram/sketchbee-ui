import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

interface IProphecyModalProps {
    isOpen: boolean;
    prophecies: string[];
    secondsLeft: number;
    onSelect: (prophecy: string) => void;
}

const ProphecyModal: React.FC<IProphecyModalProps> = ({ isOpen, prophecies, secondsLeft, onSelect }) => {
    secondsLeft = 11;
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
                            className={`text-2xl md:text-3xl font-serif tracking-tight italic transition-colors duration-500 
                            ${isPortalClosing ? "text-red-800" : "text-stone-900"}`}
                        >
                            {selectedProphecy ? "Prophecy Selected" : isPortalClosing ? "The portal is closing..." : "Choose a prophecy, Caster"}
                        </h2>
                        {isPortalClosing && !selectedProphecy && <p className="text-sm font-mono text-red-700 animate-bounce">Auto selecting...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                    {prophecies.map((word, index) => {
                        const isSelected = selectedProphecy === word;
                        const isDimmed = selectedProphecy !== null && !isSelected;

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelection(word)}
                                disabled={selectedProphecy !== null}
                                className={`group relative flex flex-col items-center justify-center py-12 px-6
                                    rounded-xl transition-all duration-500 transform
                                    ${
                                        isSelected
                                            ? "bg-amber-50 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-105 z-20"
                                            : "bg-white/60 border-stone-200/60 hover:bg-white hover:border-stone-900 hover:-translate-y-1"
                                    }
                                    ${isDimmed ? "opacity-40 grayscale-[0.5] scale-95" : "opacity-100"}
                                    ${isPortalClosing && !selectedProphecy ? "animate-pulse border-red-200" : "border"}
                                `}
                            >
                                <span
                                    className={`absolute top-4 left-4 text-[9px] font-mono transition-colors
                                    ${isSelected ? "text-amber-600" : "text-stone-400 group-hover:text-stone-900"}`}
                                >
                                    0{index + 1}
                                </span>

                                <span
                                    className={`text-xl font-serif tracking-tight transition-all duration-500
                                    ${isSelected ? "text-amber-900 scale-110 font-bold" : "text-stone-800 group-hover:text-black"}`}
                                >
                                    {word}
                                </span>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-amber-600 animate-in zoom-in duration-300">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}

                                <div
                                    className={`absolute bottom-6 transition-all duration-300 
                                    ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"}`}
                                >
                                    <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${isSelected ? "text-amber-700" : "text-stone-500"}`}>
                                        {isSelected ? "Manifested" : "Lock Prophecy"}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer status */}
                <div className="flex flex-col items-center gap-3 opacity-40">
                    <div className={`h-px transition-all duration-1000 ${isPortalClosing ? "w-48 bg-red-600" : "w-12 bg-stone-900"}`} />
                    <span className="text-[9px] uppercase tracking-[0.5em] font-medium text-stone-900">
                        {selectedProphecy ? "Prophecy Selected" : `Portal Status: ${isPortalClosing ? "Critical" : isPortalFading ? "Fading" : "Optimal"}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProphecyModal;
