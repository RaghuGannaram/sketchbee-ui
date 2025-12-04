import React, { useEffect, useState } from "react";
import { Wand2, Eye, Trophy } from "lucide-react";
import useSocket from "../hooks/useSocket";

export interface ISeer {
    seerId: string;
    socketId: string;
    chamberId?: string;
    epithet: string;
    guise: string;
    essence: number;
    isCaster: boolean;
    hasUnveiled: boolean;
    currentEssence: number;
}

const SeerCircle: React.FC = () => {
    const [seers, setSeers] = useState<ISeer[]>([]);
    const { subscribe } = useSocket();

    useEffect(() => {
        const handleChamberUpdate = (data: { seers: ISeer[] }) => {
            setSeers(data.seers);
        };

        const unsubscribe = subscribe("chamber:sync", handleChamberUpdate);

        return () => {
            unsubscribe();
        };
    }, [subscribe]);

    const sortedSeers = [...seers].sort((a, b) => b.essence - a.essence);

    return (
        <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-yellow-100/50 border-b border-yellow-200 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-700" />
                <h2 className="font-serif font-bold text-yellow-900 tracking-wide">Seer Circle</h2>
            </div>

            <ul className="flex-1 overflow-y-auto p-2 space-y-2">
                {sortedSeers.map((seer) => (
                    <li
                        key={seer.seerId}
                        className={`
                            relative flex items-center gap-3 p-2 rounded-lg transition-all
                            ${
                                seer.hasUnveiled
                                    ? "bg-green-100 border border-green-200"
                                    : "bg-white border border-transparent hover:bg-yellow-50"
                            }
                            ${seer.isCaster ? "ring-2 ring-yellow-400 bg-yellow-50" : ""}
                        `}
                    >
                        <div className="relative">
                            <img
                                src={seer.guise}
                                alt={seer.epithet.slice(0, 2)}
                                className="w-10 h-10 rounded-full bg-yellow-200 object-cover border border-yellow-300 flex items-center justify-center text-black uppercase text-sm"
                            />

                            {seer.isCaster && (
                                <div
                                    className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5 shadow-sm"
                                    title="Currently Inscribing"
                                >
                                    <Wand2 className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800 truncate text-sm">{seer.epithet}</span>
                                {seer.hasUnveiled && (
                                    <span title="Has Unveiled the Truth">
                                        <Eye className="w-4 h-4 text-green-600" />
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-0.5">
                                <span className="text-xs text-gray-500 font-mono">{seer.essence} Essence</span>
                                {seer.currentEssence > 0 && (
                                    <span className="text-xs text-green-600 font-bold animate-pulse">
                                        +{seer.currentEssence}
                                    </span>
                                )}
                            </div>
                        </div>
                    </li>
                ))}

                {seers.length === 0 && (
                    <div className="text-center p-4 text-gray-400 text-sm italic">The chamber is empty...</div>
                )}
            </ul>
        </div>
    );
};

export default SeerCircle;
