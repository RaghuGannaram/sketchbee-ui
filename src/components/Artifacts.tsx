import React from "react";
import { Eraser, Brush, Palette, Undo2, Redo2, Trash2 } from "lucide-react";
import useStylus from "../hooks/useStylus";
import useSeer from "../hooks/useSeer";
import useSocket from "../hooks/useSocket";

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

    return (
        <div className="w-full h-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <button
                    title="Etch (Brush)"
                    onClick={() => switchTip("etch")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border transition-all ${
                        tip === "etch"
                            ? "bg-yellow-400 border-yellow-500 text-white"
                            : "bg-white border-gray-300 hover:bg-yellow-50"
                    }`}
                >
                    <Brush className="w-5 h-5" /> Brush
                </button>

                <button
                    title="Rub (Eraser)"
                    onClick={() => switchTip("rub")}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border transition-all ${
                        tip === "rub"
                            ? "bg-yellow-400 border-yellow-500 text-white"
                            : "bg-white border-gray-300 hover:bg-yellow-50"
                    }`}
                >
                    <Eraser className="w-5 h-5" /> Eraser
                </button>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Brush className="w-5 h-5" />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={gauge}
                        onChange={(e) => adjustGauge(Number(e.target.value))}
                        className="w-48 accent-yellow-500"
                    />
                    <span className="text-gray-600 w-6">{gauge}px</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Palette className="w-5 h-5 text-yellow-600" />
                    <input
                        type="color"
                        value={pigment}
                        onChange={(e) => mixPigment(e.target.value)}
                        className="w-8 h-8 cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => undoHandler()}
                    className="p-2 rounded-md bg-white hover:bg-yellow-50 border border-gray-300 transition-all"
                    title="Revoke (Undo)"
                >
                    <Undo2 className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    onClick={() => redoHandler()}
                    className="p-2 rounded-md bg-white hover:bg-yellow-50 border border-gray-300 transition-all"
                    title="Invoke (Redo)"
                >
                    <Redo2 className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    onClick={() => clearHandler()}
                    className="p-2 rounded-md bg-white hover:bg-red-50 border border-gray-300 transition-all"
                    title="Banish (Clear)"
                >
                    <Trash2 className="w-5 h-5 text-red-600" />
                </button>
            </div>
        </div>
    );
};

export default Artifacts;
