// src/components/DrawingCanvas.tsx
import React, { useRef, useState, useEffect } from "react";
import useStylus from "../hooks/useStylus";
import brushCursor from "../assets/brush-cursor.png";
import eraserCursor from "../assets/eraser-cursor.png";

const DrawingCanvas: React.FC = () => {
    // 1. Subscribe to Tool State (The Stylus)
    const gauge = useStylus((s) => s.gauge);
    const pigment = useStylus((s) => s.pigment);
    const tip = useStylus((s) => s.tip); // "ETCH" or "RUB"

    // 2. Subscribe to History State (The Memory)
    // We need the pointer and snapshots to handle Undo/Redo re-rendering
    const snapshots = useStylus((s) => s.snapshots);
    const pointer = useStylus((s) => s.pointer);

    // 3. Grab Actions
    const { imprint } = useStylus((state) => ({
        imprint: state.imprint,
    }));

    // 4. Local React State (Ephemeral drawing state)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isChanneling, setIsChanneling] = useState(false); // formerly isDrawing
    const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
    const [cursorStyle, setCursorStyle] = useState<string>("crosshair");

    // --- EFFECT 1: Handle Resizing ---
    useEffect(() => {
        const resizeSlate = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scale = window.devicePixelRatio || 1;
            // Set actual canvas size to match display size * pixel density
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(scale, scale);

            // Re-render current frame after resize
            restoreFromMemory();
        };

        window.addEventListener("resize", resizeSlate);
        // Initial sizing delay to ensure container is ready
        setTimeout(resizeSlate, 10);

        return () => window.removeEventListener("resize", resizeSlate);
    }, []); // Run once on mount

    // --- EFFECT 2: Handle Undo/Redo (Restoring Memory) ---
    useEffect(() => {
        restoreFromMemory();
    }, [pointer, snapshots]);

    // Helper: Redraws the canvas based on the current history pointer
    const restoreFromMemory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear the slate
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // If we have a memory at the current pointer, draw it
        if (pointer >= 0 && snapshots[pointer]) {
            const img = new Image();
            img.src = snapshots[pointer];
            img.onload = () => {
                ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width / window.devicePixelRatio,
                    canvas.height / window.devicePixelRatio
                );
            };
        }
    };

    // --- EFFECT 3: Cursor Management ---
    useEffect(() => {
        if (tip === "rub") {
            setCursorStyle(`url(${eraserCursor}) 16 16, auto`);
        } else if (tip === "etch") {
            setCursorStyle(`url(${brushCursor}) 4 26, auto`);
        } else {
            setCursorStyle("crosshair");
        }
    }, [tip]);

    // --- HANDLERS (The Ritual) ---

    const beginEtching = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        setIsChanneling(true);
        setLastPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const continueEtching = (event: React.MouseEvent) => {
        if (!isChanneling || !canvasRef.current || !lastPoint) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Configure the physical properties of the tool
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tip === "rub") {
            // Eraser Logic
            ctx.globalCompositeOperation = "destination-out"; // Removes pixels
            ctx.lineWidth = 40; // Fixed eraser size or use gauge * 2
            ctx.strokeStyle = "rgba(0,0,0,1)"; // Color doesn't matter for destination-out
        } else {
            // Brush Logic
            ctx.globalCompositeOperation = "source-over"; // Adds pixels
            ctx.lineWidth = gauge;
            ctx.strokeStyle = pigment;
        }

        // Perform the Stroke
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPoint({ x, y });
    };

    const finishEtching = () => {
        if (!isChanneling || !canvasRef.current) return;

        setIsChanneling(false);
        setLastPoint(null);

        // IMPRINT: Save the current state to history
        // Note: We use toDataURL() to capture the pixels
        const memory = canvasRef.current.toDataURL();
        imprint(memory);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={beginEtching}
            onMouseMove={continueEtching}
            onMouseUp={finishEtching}
            onMouseLeave={finishEtching}
            className="w-full h-full bg-white border border-yellow-300 rounded-lg shadow-md cursor-pointer touch-none"
            style={{ cursor: cursorStyle }}
        />
    );
};

export default DrawingCanvas;
