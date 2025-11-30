import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface ISeerState {
    epithet: string;
    guise: string;
}

export interface ISeerActions {
    inscribe: (epithet: string, guise?: string) => void;
}

export interface ISeerStore extends ISeerState, ISeerActions {}

export const seerStore = createStore<ISeerStore>()(
    persist(
        (set) => ({
            epithet: "",
            guise: "",

            inscribe: (epithet, guise) =>
                set((state) => ({
                    epithet,
                    guise: guise || state.guise || `https://robohash.org/${epithet}.png?set=set2`,
                })),
        }),
        {
            name: "sketchbee:seer",
        }
    )
);
