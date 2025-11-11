import { useState, useEffect, useRef } from "react";

export default function CanvasBoard() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [brushSize, setBrushSize] = useState(10);
    const [hue, setHue] = useState(0);
    const [lightness, setLightness] = useState(50);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        ctxRef.current = ctx;
        saveState();
    }, []);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.lineWidth = brushSize;
            ctxRef.current.strokeStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        }
    }, [brushSize, hue, lightness]);

    const saveState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL();

        setHistory((prev) => [...prev.slice(0, historyIndex + 1), dataURL]);
        setHistoryIndex((prev) => prev + 1);
    };

    const restoreState = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx || index < 0 || index >= history.length) return;

        const img = new Image();

        img.src = history[index];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);

        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        ctx.stroke();
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveState();
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            restoreState(historyIndex - 1);
            setHistoryIndex((prev) => prev - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            restoreState(historyIndex + 1);
            setHistoryIndex((prev) => prev + 1);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHistory([]);
            setHistoryIndex(-1);
        }
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            <div className="controls">
                <label>Brush Size:</label>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
                <label>Color Hue:</label>
                <input
                    type="range"
                    id="hueSlider"
                    className="color-slider"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                />
                <label>Color Lightness:</label>
                <input
                    type="range"
                    id="lightnessSlider"
                    className="color-slider"
                    min="0"
                    max="100"
                    value={lightness}
                    onChange={(e) => setLightness(Number(e.target.value))}
                />
                <button onClick={undo} className="control-btn">
                    &#x21B6;
                </button>
                <button onClick={redo} className="control-btn">
                    &#x21B7;
                </button>
                <button onClick={clearCanvas} className="control-btn">
                    &#x1F5D1;
                </button>
            </div>
        </>
    );
}
