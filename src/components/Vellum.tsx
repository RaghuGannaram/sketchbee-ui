import React, { useRef, useState, useEffect, useCallback } from "react";
import useStylus from "../hooks/useStylus";
import useSocket from "../hooks/useSocket";
import useSeer from "../hooks/useSeer";
import brushCursor from "../assets/brush-cursor.png";
import eraserCursor from "../assets/eraser-cursor.png";

interface ISigil {
    start: { x: number; y: number };
    end: { x: number; y: number };
    tip: "etch" | "rub";
    gauge: number;
    pigment: string;
}

const Vellum: React.FC = () => {
    const tip = useStylus((state) => state.tip);
    const gauge = useStylus((state) => state.gauge);
    const pigment = useStylus((state) => state.pigment);
    const snapshots = useStylus((state) => state.snapshots);
    const pointer = useStylus((state) => state.pointer);
    const anchor = useStylus((state) => state.anchor);

    const chamberId = useSeer((state) => state.chamberId);
    const seerId = useSeer((state) => state.seerId);
    const isCaster = useSeer((state) => state.isCaster);

    const { emit, subscribe } = useSocket();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bufferRef = useRef<ISigil[]>([]);
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

    useEffect(() => {
        const pulse = setInterval(() => {
            if (bufferRef.current.length > 0) {
                emit("rune:sigil", {
                    chamberId,
                    casterId: seerId,
                    sigils: bufferRef.current,
                });
                bufferRef.current = [];
            }
        }, 50);

        return () => clearInterval(pulse);
    }, []);

    useEffect(() => {
        const handleManifestVellum = (data: { chamberId: string; casterId: string; sigils: ISigil[] }) => {
            if (data.chamberId !== chamberId) return;
            if (data.casterId === seerId) return;

            data.sigils.forEach((sigil) => {
                performStroke(sigil.start, sigil.end, sigil.tip, sigil.gauge, sigil.pigment);
            });
        };

        const unsubscribe = subscribe("rune:sigil", handleManifestVellum);

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleShiftVellum = (data: { chamberId: string; casterId: string; vision: string }) => {
            if (data.chamberId !== chamberId) return;
            if (data.casterId === seerId) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = new Image();
            img.src = data.vision;

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };
        const unsubscribe = subscribe("rune:shift", handleShiftVellum);

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleClearVellum = (data: { chamberId: string; casterId: string }) => {
            if (data.chamberId !== chamberId) return;
            if (data.casterId === seerId) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const unsubscribe = subscribe("rune:void", handleClearVellum);

        return () => {
            unsubscribe();
        };
    }, []);

    const performStroke = useCallback(
        (
            start: { x: number; y: number },
            end: { x: number; y: number },
            tip: "etch" | "rub",
            gauge: number,
            pigment: string
        ) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

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
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        },
        []
    );

    const engageStylus = (event: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        setIsCasting(true);
        setLastPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const wieldStylus = (event: React.MouseEvent) => {
        if (!isCasting || !canvasRef.current || !lastPoint) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newPoint = { x, y };

        performStroke(lastPoint, newPoint, tip, gauge, pigment);
        bufferRef.current.push({ start: lastPoint, end: newPoint, tip, gauge, pigment });

        setLastPoint(newPoint);
    };

    const disengageStylus = () => {
        if (!canvasRef.current || !isCasting) return;

        setIsCasting(false);
        setLastPoint(null);

        const vision = canvasRef.current.toDataURL();
        anchor(vision);
    };

    return (
        <div
            className={`relative w-full h-full ${isCaster ? "cursor-crosshair" : "pointer-events-none cursor-default"}`}
        >
            <canvas
                ref={canvasRef}
                onMouseDown={engageStylus}
                onMouseMove={wieldStylus}
                onMouseUp={disengageStylus}
                onMouseLeave={disengageStylus}
                className="w-full h-full bg-white border border-yellow-300 rounded-lg shadow-md cursor-pointer touch-none"
                style={{ cursor: cursorStyle }}
            />
        </div>
    );
};

export default Vellum;
