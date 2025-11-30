// src/stores/ritual.store.ts
import { create } from "zustand";
import { ChamberPhase, ISigil } from "../types/arcane.types";

interface RitualState {
    phase: ChamberPhase;
    casterId: string | null;
    omen: string | null; // The hint
    
    // The shared drawing lines (Vector data, not images)
    sigils: ISigil[]; 

    setPhase: (phase: ChamberPhase) => void;
    setOmen: (omen: string) => void;
    setCaster: (casterId: string) => void;
    
    addSigil: (sigil: ISigil) => void;
    resetRitual: () => void;
}

export const useRitualStore = create<RitualState>((set) => ({
    phase: ChamberPhase.GATHERING,
    casterId: null,
    omen: null,
    sigils: [],

    setPhase: (phase) => set({ phase }),
    setOmen: (omen) => set({ omen }),
    setCaster: (casterId) => set({ casterId }),

    addSigil: (sigil) => set((state) => ({ sigils: [...state.sigils, sigil] })),
    
    resetRitual: () => set({ 
        phase: ChamberPhase.GATHERING, 
        sigils: [], 
        omen: null, 
        casterId: null 
    }),
}));