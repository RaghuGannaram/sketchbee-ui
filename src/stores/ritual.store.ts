import { create } from "zustand";
import { ChamberPhase } from "../types";

export interface IRitualState {
    phase: ChamberPhase;
    casterId: string | null;
    omen: string | null;
}

export interface IRitualActions {
    setPhase: (phase: ChamberPhase) => void;
    setCaster: (casterId: string) => void;
    setOmen: (omen: string) => void;

    resetRitual: () => void;
}

export type IRitualStore = IRitualState & IRitualActions;

export const ritualStore = create<IRitualStore>((set) => ({
    phase: ChamberPhase.GATHERING,
    casterId: null,
    omen: null,

    setPhase: (phase) => set({ phase }),
    setOmen: (omen) => set({ omen }),
    setCaster: (casterId) => set({ casterId }),

    resetRitual: () =>
        set({
            phase: ChamberPhase.GATHERING,
            omen: null,
            casterId: null,
        }),
}));
