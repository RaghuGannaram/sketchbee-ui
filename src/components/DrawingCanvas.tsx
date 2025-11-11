import React, { useRef, useState, useEffect } from "react";
import { useGameContext } from "../contexts/GameContext";
import brushCursor from "../assets/brush-cursor.png";
import eraserCursor from "../assets/eraser-cursor.png";

const DrawingCanvas: React.FC = () => {
    const {
        brushSize,
        brushColor,
        activeTool,
        canvasFrames,
        currentFrameIndex,
        captureCanvasFrame,
        renderCanvasFrame,
    } = useGameContext();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
    const [cursorStyle, setCursorStyle] = useState<string>("crosshair");

    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scale = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(scale, scale);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const frameImage = renderCanvasFrame(currentFrameIndex);

        if (frameImage) {
            const img = new Image();

            img.src = frameImage;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [currentFrameIndex, canvasFrames, renderCanvasFrame]);

    useEffect(() => {
        if (activeTool === "eraser") {
            setCursorStyle(`url(${eraserCursor}) 16 16, auto`);
        } else if (activeTool === "brush") {
            setCursorStyle(`url(${brushCursor}) 4 26, auto`);
        } else {
            setCursorStyle("crosshair");
        }
    }, [activeTool]);

    const startDrawing = (event: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();

        setIsDrawing(true);
        setLastPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const draw = (event: React.MouseEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx || !lastPoint) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (activeTool === "eraser") {
            ctx.lineWidth = 50;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(255,255,255,1)";
        } else {
            ctx.lineWidth = brushSize;
            ctx.lineCap = "round";
            ctx.strokeStyle = brushColor;
        }

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPoint({ x, y });
    };

    const stopDrawing = () => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsDrawing(false);
        setLastPoint(null);

        const frameImage = canvas.toDataURL();
        captureCanvasFrame(frameImage);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full bg-white border border-yellow-300 rounded-lg shadow-md cursor-pointer"
            style={{ cursor: cursorStyle }}
        />
    );
};

export default DrawingCanvas;
