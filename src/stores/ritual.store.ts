import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { Rites, ISeer } from "../types";

export interface IRitualState {
    rite: Rites;
    seers: ISeer[];
    omen: string | null;
    enigma: string | null;
    unveiledSeers: ISeer[];
    casterSignature: string | null;
    currentCycle: number;
    totalCycles: number;
    terminus: number | null;
}

export interface IRitualActions {
    setRite: (phase: Rites) => void;
    setSeers: (seers: ISeer[]) => void;
    setOmen: (omen: string) => void;
    setEnigma: (enigma: string) => void;
    setCasterSignature: (casterId: string | null) => void;
    setUnveiledSeers: (seers: ISeer[]) => void;
    setTerminus: (terminus: number | null) => void;
    setCurrentCycle: (cycle: number) => void;
    setTotalCycles: (cycles: number) => void;
    resetRitual: () => void;
}

export interface IRitualStore extends IRitualState, IRitualActions {}

const INITIAL_STATE: IRitualState = {
    rite: Rites.CONGREGATION,
    seers: [],
    omen: "",
    enigma: "",
    unveiledSeers: [],
    casterSignature: null,
    currentCycle: 0,
    totalCycles: 0,
    terminus: null,
};

export const RitualStore = createStore<IRitualStore>()(
    devtools((set) => ({
        ...INITIAL_STATE,

        setRite: (rite) => set({ rite }, false, "setRite"),
        setSeers: (seers) => set({ seers }, false, "setSeers"),
        setOmen: (omen) => set({ omen }, false, "setOmen"),
        setEnigma: (enigma) => set({ enigma }, false, "setEnigma"),
        setCasterSignature: (casterSignature) => set({ casterSignature }, false, "setCaster"),
        setUnveiledSeers: (seers) => set({ unveiledSeers: seers }, false, "setUnveiledSeers"),
        setTerminus: (terminus) => set({ terminus }, false, "setTerminus"),
        setCurrentCycle: (cycle) => set({ currentCycle: cycle }, false, "setCurrentCycle"),
        setTotalCycles: (cycles) => set({ totalCycles: cycles }, false, "setTotalCycles"),
        resetRitual: () => set(INITIAL_STATE, false, "resetRitual"),
    }))
);
