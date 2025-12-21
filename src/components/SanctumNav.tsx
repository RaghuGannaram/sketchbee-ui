import React from "react";
import { ArrowLeft, Clock, Users, Flame, Feather, Sun, Skull, HelpCircle, Scroll, Sparkles, WandSparkles, Puzzle } from "lucide-react";
import { Rites } from "../types";
import useRitual from "../hooks/useRitual";

interface ISanctumNavProps {
    rite: Rites;
    secondsLeft: number;
    onLeave: () => void;
}

const SanctumNav: React.FC<ISanctumNavProps> = ({ rite, secondsLeft, onLeave }) => {
    const omen = useRitual((state) => state.omen);
    const enigma = useRitual((state) => state.enigma);

    const getRitualConfig = (rite: Rites) => {
        switch (rite) {
            case Rites.CONGREGATION:
                return {
                    label: "Congregation",
                    theme: "text-slate-600 bg-slate-50/80 border-slate-200/60 shadow-sm",
                    icon: <Users className="w-3.5 h-3.5 stroke-[2.5px]" />,
                };

            case Rites.CONSECRATION:
                return {
                    label: "Consecration",
                    theme: "text-amber-600 bg-amber-50/80 border-amber-200/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
                    icon: <Flame className="w-3.5 h-3.5 animate-pulse" />,
                };

            case Rites.DIVINATION:
                return {
                    label: "Divination",
                    theme: "text-violet-600 bg-violet-50/80 border-violet-200/50 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
                    icon: <Scroll className="w-3.5 h-3.5" />,
                };

            case Rites.MANIFESTATION:
                return {
                    label: "Manifestation",
                    theme: "text-indigo-600 bg-indigo-50/80 border-indigo-200/50 shadow-[0_0_15px_rgba(79,70,229,0.15)]",
                    icon: <Feather className="w-3.5 h-3.5" />,
                };

            case Rites.REVELATION:
                return {
                    label: "Revelation",
                    theme: "text-emerald-600 bg-emerald-50/80 border-emerald-200/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
                    icon: <Sun className="w-3.5 h-3.5 animate-[spin_8s_linear_infinite]" />,
                };

            case Rites.DISSOLUTION:
                return {
                    label: "Dissolution",
                    theme: "text-rose-600 bg-rose-50/80 border-rose-200/50",
                    icon: <Skull className="w-3.5 h-3.5" />,
                };

            default:
                return {
                    label: "Unknown",
                    theme: "text-slate-400 bg-slate-100 border-slate-200",
                    icon: <HelpCircle className="w-3.5 h-3.5" />,
                };
        }
    };
    const ritual = getRitualConfig(rite);

    return (
        <nav className="w-full flex justify-between items-center">
            <div className="flex-1">
                <button
                    onClick={onLeave}
                    className="flex items-center gap-3 px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-xl rounded-2xl hover:bg-white hover:text-rose-600 hover:border-rose-200 group transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-mono font-bold text-[10px] uppercase tracking-widest">Exit Room</span>
                </button>
            </div>

            <div className={`flex justify-between items-center gap-3 px-4 py-1.5 border rounded-full ${ritual.theme}`}>
                {ritual.icon}

                <span className="font-serif font-black text-xs tracking-[0.2em] uppercase">{ritual.label}</span>

                {secondsLeft > 0 ? (
                    <div className="flex items-center gap-1">
                        <Clock className={`w-3 h-3 `} />
                        <div className="flex items-baseline gap-0.5">
                            <span className={`font-mono text-[14px] font-black tabular-nums  transition-colors`}>{secondsLeft.toString().padStart(2, "0")}</span>
                            <span className={`text-[10px] font-mono font-bold uppercase `}>s</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase">Pending</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex justify-end items-center gap-10">
                {enigma && (
                    <div className="relative group flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-100 border border-indigo-400 shadow-lg shadow-indigo-900/20">
                        <WandSparkles className="w-4 h-4 text-indigo-700" />
                        <span className="font-serif font-black text-sm text-indigo-900 tracking-wide leading-none">{enigma}</span>
                        <Sparkles className="w-4 h-4 text-indigo-500 absolute -top-1.5 -right-1.5 animate-pulse" />
                    </div>
                )}
                {!enigma && omen && (
                    <div className="relative group flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-400 shadow-lg shadow-slate-900/20">
                        <Puzzle className="relative w-3 h-3 text-slate-700" />
                        <span className="font-serif font-black text-sm text-slate-900 tracking-[-0.15em] leading-none">
                            {omen
                                .split("")
                                .map((char) => (char === " " ? "\u00A0\u00A0\u00A0" : "_\u00A0"))
                                .join("")}
                        </span>
                        <Sparkles className="w-4 h-4 text-slate-500 absolute -top-1.5 -right-1.5 animate-pulse" />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default SanctumNav;
