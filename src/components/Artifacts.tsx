import React from "react";
import { Eraser, Brush, Undo2, Redo2, Trash2, Eye, Zap } from "lucide-react";
import useStylus from "../hooks/useStylus";
import useSeer from "../hooks/useSeer";
import useSocket from "../hooks/useSocket";
import useRitual from "../hooks/useRitual";
import { Rites } from "../types";

const Artifacts: React.FC = () => {
    const tip = useStylus((state) => state.tip);
    const gauge = useStylus((state) => state.gauge);
    const pigment = useStylus((state) => state.pigment);

    const switchTip = useStylus((state) => state.setTip);
    const adjustGauge = useStylus((state) => state.setGauge);
    const mixPigment = useStylus((state) => state.setPigment);
    const revoke = useStylus((state) => state.revoke);
    const invoke = useStylus((state) => state.invoke);
    const banish = useStylus((state) => state.banish);

    const chamberId = useSeer((state) => state.chamberId);
    const seerId = useSeer((state) => state.seerId);
    const casterSignature = useRitual((state) => state.casterSignature);

    const rite = useRitual((state) => state.rite);

    const { emit } = useSocket();

    const undoHandler = () => {
        const vision = revoke();

        if (!vision) {
            emit("rune:void", { chamberId, casterId: seerId });
        } else {
            emit("rune:shift", { chamberId, casterId: seerId, vision });
        }
    };
    const redoHandler = () => {
        const vision = invoke();

        emit("rune:shift", { chamberId, casterId: seerId, vision });
    };

    const clearHandler = () => {
        banish();

        emit("rune:void", { chamberId, casterId: seerId });
    };

    // if (casterSignature !== seerId || rite !== Rites.MANIFESTATION) {
    //     return (
    //         <div className="w-full flex items-center justify-center p-4 mt-4">
    //             <div className="flex items-center gap-3 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full border border-indigo-100/50 shadow-sm">
    //                 <Eye className="w-4 h-4 text-indigo-400 animate-pulse" />
    //                 <span className="text-[11px] font-mono font-bold text-indigo-900/40 uppercase tracking-[0.3em]">Observing Astral Flow</span>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex justify-between items-center gap-6 px-6 py-3 bg-slate-200 rounded-xl">
            <div className="flex items-center gap-1">
                <button
                    onClick={() => switchTip("etch")}
                    className={`p-2.5 rounded-lg transition-all ${tip === "etch" ? "bg-indigo-500 text-slate-100" : "text-slate-700 hover:text-indigo-600 hover:bg-slate-300"}`}
                    title="Draw"
                >
                    <Brush className="w-5 h-5" />
                </button>
                <button
                    onClick={() => switchTip("rub")}
                    className={`p-2.5 rounded-lg transition-all ${tip === "rub" ? "bg-indigo-500 text-slate-100" : "text-slate-700 hover:text-indigo-600 hover:bg-slate-300"}`}
                    title="Erase"
                >
                    <Eraser className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-xs">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={gauge}
                    onChange={(e) => adjustGauge(Number(e.target.value))}
                    className="flex-1 h-1 bg-indigo-400 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[12px] font-mono font-black text-indigo-500 w-8">{gauge}px</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-2 group cursor-pointer">
                    <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-indigo-100 overflow-hidden" style={{ backgroundColor: pigment }}>
                        <input type="color" value={pigment} onChange={(e) => mixPigment(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer scale-150" />
                    </div>
                </div>

                <div className="h-6 w-px bg-slate-400 mx-1" />

                <div className="flex items-center gap-0.5">
                    <button onClick={() => undoHandler()} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                        <Undo2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => redoHandler()} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                        <Redo2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => clearHandler()} className="p-2 text-slate-400 hover:text-rose-500 transition-colors ml-2">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Artifacts;
