// src/context/GameContext.tsx
import React, { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type ToolType = "brush" | "eraser";

interface GameContextProps {
    brushSize: number;
    setBrushSize: (size: number) => void;

    brushColor: string;
    setBrushColor: (color: string) => void;

    activeTool: ToolType;
    setActiveTool: (tool: ToolType) => void;

    canvasFrames: string[];
    currentFrameIndex: number;

    captureCanvasFrame: (dataURL: string) => void;
    renderCanvasFrame: (index: number) => string | null;

    undo: () => void;
    redo: () => void;

    clearHistory: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brushSize, setBrushSize] = useLocalStorage("sketchbee:brushSize", 1);
    const [brushColor, setBrushColor] = useLocalStorage("sketchbee:brushColor", "#000000");
    const [activeTool, setActiveTool] = useLocalStorage<ToolType>("sketchbee:activeTool", "brush");

    const [canvasFrames, setCanvasFrames] = useState<string[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(-1);

    const captureCanvasFrame = (frameImage: string) => {
        setCanvasFrames((prev) => {
            const trimmed = prev.slice(0, currentFrameIndex + 1);
            const updated = [...trimmed, frameImage];

            setCurrentFrameIndex(updated.length - 1);
            return updated;
        });
    };

    const renderCanvasFrame = (index: number) => {
        if (index < 0 || index >= canvasFrames.length) return null;
        return canvasFrames[index];
    };

    const undo = () => {
        setCurrentFrameIndex((index) => (index >= 0 ? index - 1 : index));
    };

    const redo = () => {
        setCurrentFrameIndex((index) => (index < canvasFrames.length - 1 ? index + 1 : index));
    };

    const clearHistory = () => {
        setCanvasFrames([]);
        setCurrentFrameIndex(-1);
    };

    return (
        <GameContext.Provider
            value={{
                brushSize,
                setBrushSize,
                brushColor,
                setBrushColor,
                activeTool,
                setActiveTool,
                canvasFrames,
                currentFrameIndex,
                captureCanvasFrame,
                renderCanvasFrame,
                undo,
                redo,
                clearHistory,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const gameContext = useContext(GameContext);

    if (!gameContext) {
        console.log("sketchbee-error: useGameContext must be used within GameProvider");

        throw new Error("useGameContext must be used within GameProvider");
    }

    return gameContext;
};
