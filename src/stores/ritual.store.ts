import { create } from "zustand";
import { RitualPhase, type RitualPhaseType } from "../types";

export interface IRitualState {
    phase: RitualPhaseType;
    omen: string | null;
    prophecy: string | null;
    casterId: string | null;
    unvailedSeers:any[]
}

export interface IRitualActions {
    setPhase: (phase: RitualPhaseType) => void;
    setCaster: (casterId: string) => void;
    setProphecy: (prophecy: string) => void;
    setOmen: (omen: string) => void;

    resetRitual: () => void;
}

export type IRitualStore = IRitualState & IRitualActions;

export const ritualStore = create<IRitualStore>((set) => ({
    phase: RitualPhase.CONGREGATION,
    casterId: null,
    omen: null,
    prophecy: null,
    unvailedSeers:[],

    setPhase: (phase) => set({ phase }),
    setOmen: (omen) => set({ omen }),
    setProphecy: (prophecy) => set({ prophecy }),
    setCaster: (casterId) => set({ casterId }),

    resetRitual: () =>
        set({
            phase: RitualPhase.CONGREGATION,
            omen: null,
            casterId: null,
        }),
}));
