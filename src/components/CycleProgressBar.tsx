import useRitual from "../hooks/useRitual";

const CycleProgressBar = () => {
    const currentCycle = useRitual((state) => state.currentCycle);
    const totalCycles = useRitual((state) => state.totalCycles);

    const isAwaiting = totalCycles === 0;
    const isLastCycle = totalCycles > 0 && currentCycle === totalCycles;
    const progressPercentage = totalCycles > 0 ? (currentCycle / totalCycles) * 100 : 0;

    const getStatusText = () => {
        if (isAwaiting) {
            return "Waiting for players to join...";
        }

        if (isLastCycle) {
            return "Final round in progress";
        }

        return `${currentCycle}/${totalCycles} round in progress`;
    };

    return (
        <div className="px-6 py-4 bg-slate-500/5 border-t border-slate-100 flex justify-between items-center transition-all duration-500">
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-[0.3em]">Round</span>
                <span className="font-mono text-slate-900 font-black text-xs uppercase tracking-widest">
                    {currentCycle} <span className="text-slate-300 mx-0.5">/</span> {totalCycles}
                </span>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="h-1.5 w-32 bg-slate-300 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full transition-all duration-1000 ease-in-out rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]`}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <span className={`text-[8px] font-mono font-black uppercase tracking-widest transition-colors duration-500 text-slate-500`}>{getStatusText()}</span>
            </div>
        </div>
    );
};

export default CycleProgressBar;
