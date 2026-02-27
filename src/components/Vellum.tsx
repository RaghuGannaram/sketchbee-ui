import React, { useRef, useState, useEffect, useCallback } from "react";
import useStylus from "../hooks/useStylus";
import useSocket from "../hooks/useSocket";
import useSeer from "../hooks/useSeer";
import useRitual from "../hooks/useRitual";
import brushCursor from "../assets/brush-cursor.png";
import eraserCursor from "../assets/eraser-cursor.png";
import { Rites } from "../types";

interface ISigil {
	start: { x: number; y: number };
	end: { x: number; y: number };
	tip: "etch" | "rub";
	gauge: number;
	pigment: string;
}

const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;

const Vellum: React.FC = () => {
	const tip = useStylus((state) => state.tip);
	const gauge = useStylus((state) => state.gauge);
	const pigment = useStylus((state) => state.pigment);
	const snapshots = useStylus((state) => state.snapshots);
	const pointer = useStylus((state) => state.pointer);
	const anchor = useStylus((state) => state.anchor);
	const banish = useStylus((state) => state.banish);

	const chamberId = useSeer((state) => state.chamberId);
	const seerId = useSeer((state) => state.seerId);
	const casterSignature = useRitual((state) => state.casterSignature);
	const rite = useRitual((state) => state.rite);

	const { emit, subscribe } = useSocket();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const bufferRef = useRef<ISigil[]>([]);

	const [isCasting, setIsCasting] = useState(false);
	const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
	const [cursorStyle, setCursorStyle] = useState<string>("crosshair");

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		if (pointer >= 0 && snapshots[pointer]) {
			const img = new Image();

			img.src = snapshots[pointer];
			img.onload = () => {
				ctx.globalCompositeOperation = "source-over";

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
	}, [chamberId, seerId]);

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
	}, [chamberId, seerId]);

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
				ctx.globalCompositeOperation = "source-over";

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			};
		};
		const unsubscribe = subscribe("rune:shift", handleShiftVellum);

		return () => {
			unsubscribe();
		};
	}, [chamberId, seerId]);

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
	}, [chamberId, seerId]);

	useEffect(() => {
		if (rite === Rites.CONSECRATION) {
			console.log("sketchbee-log: Consecration detected, purging Vellum...");

			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			banish();
			bufferRef.current = [];
		}
	}, [rite, anchor]);

	const performStroke = useCallback((start: { x: number; y: number }, end: { x: number; y: number }, tip: "etch" | "rub", gauge: number, pigment: string) => {
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
	}, []);

	const getMappedCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
		if (!canvasRef.current) return null;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		let clientX, clientY;
		if ("touches" in event) {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		} else {
			clientX = (event as React.MouseEvent).clientX;
			clientY = (event as React.MouseEvent).clientY;
		}

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		return {
			x: (clientX - rect.left) * scaleX,
			y: (clientY - rect.top) * scaleY,
		};
	};

	const engageStylus = (event: React.MouseEvent | React.TouchEvent) => {
		const coordinates = getMappedCoordinates(event);
		if (!coordinates) return;

		setIsCasting(true);
		setLastPoint(coordinates);
	};

	const wieldStylus = (event: React.MouseEvent | React.TouchEvent) => {
		if (!canvasRef.current || !isCasting || !lastPoint) return;

		const newPoint = getMappedCoordinates(event);
		if (!newPoint) return;

		performStroke(lastPoint, newPoint, tip, gauge, pigment);
		bufferRef.current.push({ start: lastPoint, end: newPoint, tip, gauge, pigment });

		setLastPoint(newPoint);
	};

	const disengageStylus = () => {
		if (!canvasRef.current || !isCasting || !lastPoint) return;

		setIsCasting(false);
		setLastPoint(null);

		const vision = canvasRef.current.toDataURL();
		anchor(vision);
	};

	return (
		<div
			className={`relative w-full h-full flex items-center justify-center bg-slate-100 select-none ${casterSignature === seerId && rite === Rites.MANIFESTATION ? "cursor-default" : "pointer-events-none cursor-default"}`}
		>
			<canvas
				ref={canvasRef}
				width={VIRTUAL_WIDTH}
				height={VIRTUAL_HEIGHT}
				onMouseDown={engageStylus}
				onMouseMove={wieldStylus}
				onMouseUp={disengageStylus}
				onMouseLeave={disengageStylus}
				onTouchStart={engageStylus}
				onTouchMove={wieldStylus}
				onTouchEnd={disengageStylus}
				onTouchCancel={disengageStylus}
				className="max-w-full max-h-full object-contain bg-white touch-none"
				style={{ cursor: cursorStyle, aspectRatio: "16/9" }}
			/>
		</div>
	);
};

export default Vellum;
