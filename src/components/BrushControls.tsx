// src/components/BrushControls.tsx
import React from "react";
import { Eraser, Brush, Palette, Undo2, Redo2, Trash2 } from "lucide-react";
import { useGameContext } from "../contexts/GameContext";

const BrushControls: React.FC = () => {
    const { brushSize, setBrushSize, brushColor, setBrushColor, activeTool, setActiveTool, undo, redo, clearHistory } =
        useGameContext();

    const brushHandler = () => {
        setActiveTool("brush");
    };
    const eraserHandler = () => {
        setActiveTool("eraser");
    };

    return (
        <div className="w-full h-full flex flex-col sm:flex-row justify-between items-center gap-4 ">
            <div className="flex items-center gap-4">
                <button
                    title="Brush Tool"
                    onClick={brushHandler}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border transition-all ${
                        activeTool === "brush"
                            ? "bg-yellow-400 border-yellow-500 text-white"
                            : "bg-white border-gray-300 hover:bg-yellow-50"
                    }`}
                >
                    <Brush className="w-5 h-5" /> Brush
                </button>

                <button
                    title="Eraser Tool"
                    onClick={eraserHandler}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border transition-all ${
                        activeTool === "eraser"
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
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-48 accent-yellow-500"
                    />
                    <span className="text-gray-600 w-6">{brushSize}px</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Palette className="w-5 h-5 text-yellow-600" />
                    <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-8 h-8 cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={undo}
                    className="p-2 rounded-md bg-white hover:bg-yellow-50 border border-gray-300 transition-all"
                    title="Undo"
                >
                    <Undo2 className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    onClick={redo}
                    className="p-2 rounded-md bg-white hover:bg-yellow-50 border border-gray-300 transition-all"
                    title="Redo"
                >
                    <Redo2 className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    onClick={clearHistory}
                    className="p-2 rounded-md bg-white hover:bg-red-50 border border-gray-300 transition-all"
                    title="Clear Canvas"
                >
                    <Trash2 className="w-5 h-5 text-red-600" />
                </button>
            </div>
        </div>
    );
};

export default BrushControls;
