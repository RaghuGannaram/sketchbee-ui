import React from "react";
import { ArrowLeft, Clock, Users, Flame, Feather, Sun, Skull, HelpCircle, Scroll, User2, Sparkles, WandSparkles, EyeClosed } from "lucide-react";
import { Rites } from "../types";

interface ISanctumNavProps {
    rite: Rites;
    secondsLeft: number;
    omen: string | null;
    enigma: string | null;
    epithet: string;
    onLeave: () => void;
}

const SanctumNav: React.FC<ISanctumNavProps> = ({ rite, secondsLeft, omen, enigma, epithet, onLeave }) => {
    const getRitualConfig = (rite: Rites) => {
        switch (rite) {
            case Rites.CONGREGATION:
                return {
                    label: "Congregation",
                    // Neutral Stone: Represents the solid gathering of people
                    color: "text-stone-300 bg-stone-800/40 border-stone-700/30",
                    icon: <Users className="w-4 h-4" />,
                };

            case Rites.CONSECRATION:
                return {
                    label: "Consecration",
                    // Burning Orange: Represents the Sacred Fire/Ignition
                    color: "text-orange-400 bg-orange-950/40 border-orange-500/20",
                    icon: <Flame className="w-4 h-4 animate-pulse" />,
                };

            case Rites.DIVINATION:
                return {
                    label: "Divination",
                    // Mystic Violet: Represents Mystery and the Void
                    color: "text-violet-400 bg-violet-950/40 border-violet-500/20",
                    icon: <Scroll className="w-4 h-4" />,
                };

            case Rites.MANIFESTATION:
                return {
                    label: "Manifestation",
                    // Ethereal Teal: Represents Spirit/Wind (Feather) and bringing things to life
                    color: "text-teal-400 bg-teal-950/40 border-teal-500/20",
                    icon: <Feather className="w-4 h-4" />,
                };

            case Rites.REVELATION:
                return {
                    label: "Revelation",
                    // Radiant Amber/Gold: Represents the Sun and Truth
                    color: "text-amber-300 bg-amber-950/40 border-amber-500/20",
                    icon: <Sun className="w-4 h-4 animate-[spin_10s_linear_infinite]" />,
                };

            case Rites.DISSOLUTION:
                return {
                    label: "Dissolution",
                    // Crimson Red: Represents the End/Death
                    color: "text-red-400 bg-red-950/40 border-red-500/20",
                    icon: <Skull className="w-4 h-4" />,
                };

            default:
                return {
                    label: "Unknown",
                    color: "text-stone-600 bg-stone-900/50 border-stone-800",
                    icon: <HelpCircle className="w-4 h-4" />,
                };
        }
    };
    const ritual = getRitualConfig(rite);
    const isCulminating = 0 < secondsLeft && secondsLeft <= 1;

    return (
        <nav className="h-15 w-full flex justify-between items-center">
            <div className="flex flex-1 justify-between items-center">
                <button
                    onClick={onLeave}
                    className="flex items-center gap-2 px-2 py-1 text-stone-600 bg-white/40 border rounded-full border-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 hover:text-red-600 group transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-serif font-medium text-sm pr-2 opacity-70 group-hover:opacity-100">Leave Chamber</span>
                </button>
            </div>

            <div className={`min-w-40 flex justify-between items-center border rounded-full overflow-hidden border-white/10 shadow-lg backdrop-blur-xl bg-stone-600/80`}>
                {isCulminating && <div className="absolute inset-0 bg-red-500/10 animate-pulse" />}

                <div className={`flex justify-between items-center gap-2 pl-5 pr-3 py-2 font-serif font-bold tracking-widest uppercase text-xs ${ritual.color}`}>
                    {ritual.icon}
                    <span className="drop-shadow-sm">{ritual.label}</span>
                </div>

                <div className="h-4 w-px bg-white/10" />

                <div className={`flex justify-between items-center gap-0.5 pl-3 pr-5 py-2 ${isCulminating ? "text-red-400" : "text-stone-200"}`}>
                    {secondsLeft > 0 ? (
                        <>
                            <Clock className={`w-3.5 h-3.5`} />
                            <span className={`min-w-5 font-mono text-base text-end font-bold leading-none tabular-nums `}>{secondsLeft}</span>
                            <span className={`text-[14px] font-medium ${isCulminating ? "text-red-400" : "text-stone-200"}`}>s</span>
                        </>
                    ) : (
                        <span className="text-[10px] text-stone-200 font-medium italic tracking-wide">WAITING</span>
                    )}
                </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-10">
                {enigma && (
                    <div className="relative group flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-400 shadow-lg shadow-amber-900/20">
                        <WandSparkles className="w-4 h-4 text-amber-700" />
                        <span className="font-serif font-black text-sm text-amber-900 tracking-wide leading-none">{enigma}</span>
                        <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1.5 -right-1.5 animate-pulse" />
                    </div>
                )}
                {!enigma && omen && (
                    <div className="relative group flex items-center gap-3 px-4 py-1.5 rounded-full bg-teal-100 border border-teal-400 shadow-lg shadow-teal-900/20">
                        <EyeClosed className="w-4 h-4 text-teal-700 top-2" />
                        <span className="font-serif font-black text-sm text-teal-900 tracking-[-0.12em] leading-none">
                            {omen
                                .split("")
                                .map((char) => (char === " " ? "\u00A0\u00A0\u00A0" : "_"))
                                .join("")}
                        </span>
                        <Sparkles className="w-4 h-4 text-teal-500 absolute -top-1.5 -right-1.5 animate-pulse" />
                    </div>
                )}

                {/* <div className="flex justify-end items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                    <span className="font-serif font-bold text-stone-800">{epithet}</span>
                    <div className="p-1 rounded-full bg-stone-800/10">
                        <User2 className="w-[15px] h-[15px] text-stone-800 relative" />
                    </div>
                </div> */}
            </div>
        </nav>
    );
};

export default SanctumNav;
