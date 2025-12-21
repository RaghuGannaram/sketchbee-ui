import React from "react";
import { ISeer } from "../types";
import { Trophy, TrendingUp, Clock, Zap } from "lucide-react";

interface IRevelationModalProps {
    enigma: string;
    unveiledSeers: ISeer[];
    secondsLeft: number;
}

const RevelationModal: React.FC<IRevelationModalProps> = ({ enigma, unveiledSeers, secondsLeft }) => {
    const sortedSeers = [...unveiledSeers].sort((a, b) => b.currentEssence - a.currentEssence);
    const topScorer = sortedSeers[0];

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-slate-900/5 backdrop-blur-xl transition-all duration-700">
            <div className="w-full max-w-4xl p-8 flex flex-col items-center gap-8 relative z-10">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900 text-slate-100">
                        <Clock className="w-3 h-3 text-slate-200" />
                        <span className="font-mono font-bold text-[10px] tracking-[0.3em] uppercase">next round starts in • 00:{secondsLeft.toString().padStart(2, "0")}</span>
                    </div>

                    <div className="space-y-1">
                        <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-slate-500">It was</h2>
                        <h1 className="font-mono text-4xl md:text-5xl uppercase tracking-widest text-slate-900 font-bold">{enigma}</h1>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-2xl">
                    <div className="flex px-6 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">
                        <span className="w-12">Rank</span>
                        <span className="flex-1">Player</span>
                        <span className="w-24 text-right">Current</span>
                        <span className="w-24 text-right">Total</span>
                    </div>
                    {sortedSeers.length === 0 && (
                        <div className="px-6 py-4 bg-slate-200/50 rounded-lg border border-slate-200/70 text-center text-slate-500 italic">
                            No player guessed it correctly.
                        </div>
                    )}
                    {sortedSeers.map((seer, index) => {
                        const isWinner = seer.currentEssence > 0 && seer.seerId === topScorer?.seerId;

                        return (
                            <div
                                key={seer.seerId}
                                className={`group relative flex items-center px-6 py-4 rounded-lg border transition-all duration-300 
                                            ${isWinner ? "bg-white border-amber-200 shadow-md scale-[1.02] z-10" : "bg-slate-200/30 border-slate-200/50 hover:bg-slate-200/50"}`}
                            >
                                <div className="w-12 flex items-center">
                                    {index === 0 ? <Trophy className="w-4 h-4 text-amber-500" /> : <span className="font-mono text-sm font-bold text-slate-400">#{index + 1}</span>}
                                </div>

                                <div className="flex-1 flex gap-2 justify-start items-center">
                                    <img src={seer.guise} alt={seer.epithet[0]} className="w-8 h-8 rounded-full object-cover border border-white" />
                                    <span className="font-mono text-base font-bold text-slate-900 leading-none">{seer.epithet}</span>
                                </div>

                                <div className={`flex items-center gap-1 font-mono text-sm font-bold ${seer.currentEssence > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                                    {seer.currentEssence > 0 && <TrendingUp className={`w-3 h-3 fill-current`} />}
                                    <span>+{seer.currentEssence}</span>
                                </div>

                                <div className="w-24 flex gap-1 justify-end items-center">
                                    <Zap className="w-3 h-3 text-slate-900" />
                                    <span className="font-mono text-lg font-black text-slate-900 italic leading-none">{seer.essence}</span>
                                </div>

                                {isWinner && <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-indigo-500 rounded-full" />}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center gap-3 opacity-60">
                    <div className="h-px w-24 bg-slate-900" />
                    <span className="font-mono font-medium text-[9px] uppercase tracking-[0.5em] text-slate-900 flex items-center gap-2">End of Revelation</span>
                </div>
            </div>
        </div>
    );
};

export default RevelationModal;
