import React, { useRef, useState, useEffect } from "react";
import useStylus from "../hooks/useStylus";
import brushCursor from "../assets/brush-cursor.png";
import eraserCursor from "../assets/eraser-cursor.png";

const Vellum: React.FC = () => {
    const gauge = useStylus((state) => state.gauge);
    const pigment = useStylus((state) => state.pigment);
    const tip = useStylus((state) => state.tip);
    const snapshots = useStylus((state) => state.snapshots);
    const pointer = useStylus((state) => state.pointer);
    const imprint = useStylus((state) => state.imprint);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCasting, setIsCasting] = useState(false);
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

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (pointer >= 0 && snapshots[pointer]) {
            const img = new Image();

            img.src = snapshots[pointer];
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [pointer, snapshots]);

    useEffect(() => {
        if (tip === "rub") {
            setCursorStyle(`url(${eraserCursor}) 16 16, auto`);
        } else if (tip === "etch") {
            setCursorStyle(`url(${brushCursor}) 4 26, auto`);
        } else {
            setCursorStyle("crosshair");
        }
    }, [tip]);

    const prepareCasting = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        setIsCasting(true);
        setLastPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const continueCasting = (event: React.MouseEvent) => {
        if (!isCasting || !canvasRef.current || !lastPoint) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (tip === "rub") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 50;
            ctx.strokeStyle = "rgba(0,0,0,1)";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = gauge;
            ctx.strokeStyle = pigment;
        }

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPoint({ x, y });
    };

    const finishCasting = () => {
        if (!isCasting || !canvasRef.current) return;

        setIsCasting(false);
        setLastPoint(null);

        const memory = canvasRef.current.toDataURL();
        imprint(memory);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={prepareCasting}
            onMouseMove={continueCasting}
            onMouseUp={finishCasting}
            onMouseLeave={finishCasting}
            className="w-full h-full bg-white border border-yellow-300 rounded-lg shadow-md cursor-pointer touch-none"
            style={{ cursor: cursorStyle }}
        />
    );
};

export default Vellum;
