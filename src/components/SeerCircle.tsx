import React, { useEffect } from "react";
import { Wand2, Eye, UsersRound, Zap } from "lucide-react";
import CycleProgressBar from "./CycleProgressBar";
import useRitual from "../hooks/useRitual";

const SeerCircle: React.FC = () => {
    const seers = useRitual((state) => state.seers);
    const unveiledSeers = useRitual((state) => state.unveiledSeers);
    const casterSignature = useRitual((state) => state.casterSignature);

    const setSeers = useRitual((state) => state.setSeers);

    const syncedSeers = React.useMemo(() => {
        return seers.map((seer) => {
            const unveiledSeer = unveiledSeers.find((u) => u.seerId === seer.seerId);

            if (unveiledSeer) {
                return {
                    ...seer,
                    currentEssence: unveiledSeer.currentEssence,
                    essence: unveiledSeer.essence,
                };
            }
            return seer;
        });
    }, [seers, unveiledSeers]);

    const sortedSeers = [...syncedSeers].sort((a, b) => b.essence - a.essence);

    useEffect(() => {
        if (unveiledSeers.length > 0) {
            setSeers(syncedSeers);
        }
    }, [unveiledSeers, setSeers]);

    return (
        <div className="w-full h-full flex flex-col bg-slate-100 backdrop-blur-2xl border border-indigo-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
            <div className="px-6 py-5 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-2xl">
                        <UsersRound className="w-4 h-4 text-slate-900 stroke-[2px]" />
                    </div>
                    <h2 className="font-mono font-bold text-slate-100 tracking-[0.3em] uppercase text-xs">Leader board</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-100 rounded-full shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] text-slate-900 uppercase font-black tracking-tighter">
                        {sortedSeers.length} {sortedSeers.length === 1 ? "Player" : "Players"}
                    </span>
                </div>
            </div>

            <ul className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth scrollbar-hide">
                {sortedSeers.map((seer) => {
                    const isUnveiled = unveiledSeers.some((s) => s.seerId === seer.seerId);
                    const isCaster = seer.seerId === casterSignature;

                    return (
                        <li
                            key={seer.seerId}
                            className={`
                                relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group
                                ${isUnveiled ? "bg-indigo-200 shadow-sm scale-[1.01] z-10" : "bg-slate-200"}
                                
                            `}
                        >
                            <div className="relative shrink-0">
                                <div className={`p-0.5 rounded-full transition-all duration-500 ${isUnveiled ? "bg-indigo-400/80" : "bg-indigo-200"}`}>
                                    <img src={seer.guise} alt={seer.epithet[0]} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                                </div>
                                {isCaster && (
                                    <div className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
                                        <Wand2 className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className={`text-[14px] font-bold tracking-tight ${isUnveiled ? "text-indigo-900" : "text-slate-700"}`}>{seer.epithet}</span>
                                    {isUnveiled && (
                                        <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                            <Eye className="w-2.5 h-2.5 text-indigo-600" />
                                            <span className="text-[8px] font-mono font-black text-indigo-600 uppercase tracking-widest">Guessed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1 opacity-60">
                                        <Zap className="w-2.5 h-2.5 text-slate-700" />
                                        <span className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-widest -mb-0.3">{seer.essence} points</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <CycleProgressBar />
        </div>
    );
};

export default SeerCircle;
