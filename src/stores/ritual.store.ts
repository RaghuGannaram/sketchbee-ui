import { createStore } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Rites, ISeer } from "../types";

export interface IRitualState {
    rite: Rites;
    omen: string | null;
    enigma: string | null;
    unveiledSeers: ISeer[];
    casterSignature: string | null;
    terminus: number | null;
}

export interface IRitualActions {
    setRite: (phase: Rites) => void;
    setOmen: (omen: string) => void;
    setEnigma: (enigma: string) => void;
    setCasterSignature: (casterId: string | null) => void;
    setUnveiledSeers: (seers: ISeer[]) => void;
    setTerminus: (terminus: number | null) => void;
    resetRitual: () => void;
}

export interface IRitualStore extends IRitualState, IRitualActions {}

const INITIAL_STATE: IRitualState = {
    rite: Rites.CONGREGATION,
    omen: "",
    enigma: "",
    unveiledSeers: [],
    casterSignature: null,
    terminus: null,
};

export const RitualStore = createStore<IRitualStore>()(
    devtools((set) => ({
        ...INITIAL_STATE,

        setRite: (rite) => set({ rite }, false, "setRite"),
        setOmen: (omen) => set({ omen }, false, "setOmen"),
        setEnigma: (enigma) => set({ enigma }, false, "setEnigma"),
        setCasterSignature: (casterSignature) => set({ casterSignature }, false, "setCaster"),
        setUnveiledSeers: (seers) => set({ unveiledSeers: seers }, false, "setUnveiledSeers"),
        setTerminus: (terminus) => set({ terminus }, false, "setTerminus"),

        resetRitual: () => set(INITIAL_STATE, false, "resetRitual"),
    }))
);
