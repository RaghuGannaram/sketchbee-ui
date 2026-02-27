import React, { useState, useEffect, useRef } from "react";
import { Wand2, Eye, UsersRound, Zap, ChevronDown, ChevronUp } from "lucide-react";
import CycleProgressBar from "./CycleProgressBar";
import useRitual from "../hooks/useRitual";

const SeerCircle: React.FC = () => {
	const seers = useRitual((state) => state.seers);
	const unveiledSeers = useRitual((state) => state.unveiledSeers);
	const casterSignature = useRitual((state) => state.casterSignature);

	const setSeers = useRitual((state) => state.setSeers);

	const [isExpanded, setIsExpanded] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const syncedSeers = React.useMemo(() => {
		return seers.map((seer) => {
			const unveiledSeer = unveiledSeers.find((u) => u.seerId === seer.seerId);

			if (unveiledSeer) {
				return {
					...seer,
					currentEssence: unveiledSeer.currentEssence,
					essence: unveiledSeer.essence,
				};
			}
			return seer;
		});
	}, [seers, unveiledSeers]);

	const sortedSeers = [...syncedSeers].sort((a, b) => b.essence - a.essence);

	useEffect(() => {
		if (unveiledSeers.length > 0) {
			setSeers(syncedSeers);
		}
	}, [unveiledSeers, setSeers]);

	useEffect(() => {
		const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
			if (isExpanded && containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsExpanded(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideInteraction);
		document.addEventListener("touchstart", handleOutsideInteraction);

		return () => {
			document.removeEventListener("mousedown", handleOutsideInteraction);
			document.removeEventListener("touchstart", handleOutsideInteraction);
		};
	}, [isExpanded]);

	return (
		<div
			ref={containerRef}
			className="relative z-50 w-full xl:h-full flex flex-col bg-slate-100 backdrop-blur-2xl border border-indigo-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-xl transition-all duration-300 ease-in-out"
		>
			<div
				className={`px-6 py-5 bg-slate-900 flex items-center justify-between gap-4 rounded-t-xl ${isExpanded ? "" : "rounded-b-xl xl:rounded-b-none"}`}
			>
				<div className={`${isExpanded ? "flex" : "hidden xl:flex"} items-center gap-3`}>
					<div className="p-2.5 bg-indigo-100 rounded-2xl">
						<UsersRound className="w-4 h-4 text-slate-900 stroke-[2px]" />
					</div>
					<h2 className="font-mono font-bold text-slate-100 tracking-[0.3em] uppercase text-xs whitespace-nowrap">Leader board</h2>
				</div>

				<div className={`${isExpanded ? "hidden" : "flex xl:hidden"} items-center flex-1 overflow-x-auto scrollbar-hide`}>
					<div className="flex -space-x-3 px-0 py-0">
						{sortedSeers.map((seer, index) => {
							const isUnveiled = unveiledSeers.some((s) => s.seerId === seer.seerId);
							return (
								<div key={seer.seerId} className="relative" style={{ zIndex: 10 + index }}>
									<div className={`relative rounded-full border-2 ${isUnveiled ? "border-indigo-400" : "border-slate-700"}`}>
										<img src={seer.guise} alt={seer.epithet[0]} className="w-8 h-8 rounded-full object-cover" />
									</div>
									{seer.seerId === casterSignature && (
										<div className="absolute top-0 -right-1 bg-slate-100 text-slate-900 rounded-full p-1 shadow-lg ring-2">
											<Wand2 className="w-3 h-3" />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 px-3 py-[5px] bg-indigo-100 border border-indigo-100 rounded-full shadow-sm">
						<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
						<span className="font-mono text-[9px] text-slate-900 uppercase font-black tracking-tighter">
							{sortedSeers.length} {sortedSeers.length === 1 ? "Player" : "Players"}
						</span>
					</div>

					<button
						onClick={() => setIsExpanded((prevExpanded) => !prevExpanded)}
						className="flex xl:hidden items-center justify-center p-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
					>
						{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
					</button>
				</div>
			</div>

			<div
				className={`
                ${isExpanded ? "flex" : "hidden xl:flex"} 
                flex-col justify-between
                absolute top-full left-0 w-full z-50 
                bg-slate-100 backdrop-blur-3xl shadow-2xl rounded-b-xl border border-indigo-100 border-t-0
                xl:static xl:h-full xl:bg-transparent xl:shadow-none xl:border-none xl:z-auto
            `}
			>
				<ul className={`flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth scrollbar-hide`}>
					{sortedSeers.map((seer) => {
						const isUnveiled = unveiledSeers.some((s) => s.seerId === seer.seerId);
						const isCaster = seer.seerId === casterSignature;

						return (
							<li
								key={seer.seerId}
								className={`
                                relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                                ${isUnveiled ? "bg-indigo-200 shadow-sm scale-[1.01] z-10" : "bg-slate-200"}
                                
                            `}
							>
								<div className="relative">
									<div className={`rounded-full transition-all duration-500 ${isUnveiled ? "bg-indigo-400/80" : "bg-indigo-200"}`}>
										<img src={seer.guise} alt={seer.epithet[0]} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
									</div>
									{isCaster && (
										<div className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
											<Wand2 className="w-2 h-2" />
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center mb-0.5">
										<span className={`text-[14px] font-bold tracking-tight ${isUnveiled ? "text-indigo-900" : "text-slate-700"}`}>
											{seer.epithet}
										</span>
										{isUnveiled && (
											<div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
												<Eye className="w-2.5 h-2.5 text-indigo-600" />
												<span className="text-[8px] font-mono font-black text-indigo-600 uppercase tracking-widest">Guessed</span>
											</div>
										)}
									</div>

									<div className="flex justify-between items-center">
										<div className="flex items-center gap-1 opacity-60">
											<Zap className="w-2.5 h-2.5 text-slate-700" />
											<span className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-widest -mb-0.3">
												{seer.essence} points
											</span>
										</div>
									</div>
								</div>
							</li>
						);
					})}
				</ul>

				<div>
					<CycleProgressBar />
				</div>
			</div>
		</div>
	);
};

export default SeerCircle;
