import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface ISeerState {
    seerId: string | null;
    socketId: string | null;
    chamberId: string | null;

    epithet: string;
    guise: string;

    essence: number;
    currentEssence: number;
    isCaster: boolean;
    hasUnveiled: boolean;
}

export interface ISeerActions {
    incarnate: (epithet: string, guise?: string) => void;
    tether: (data: any) => void;
    sever: () => void;
    transmute: (updates: Partial<ISeerState>) => void;
}

export interface ISeerStore extends ISeerState, ISeerActions {}

export const seerStore = createStore<ISeerStore>()(
    persist(
        (set) => ({
            chamberId: null,
            socketId: null,
            seerId: null,
            epithet: "",
            guise: "",
            essence: 0,
            currentEssence: 0,
            isCaster: false,
            hasUnveiled: false,

            incarnate: (epithet) =>
                set((_state) => ({
                    epithet,
                    guise: `https://api.dicebear.com/7.x/notionists/svg?seed=${epithet}`,
                })),

            tether: (response) =>
                set((state) => {
                    const seerData = response.seer;
                    const chamberId = response.chamberId;

                    return {
                        chamberId: chamberId,
                        socketId: seerData.socketId,
                        seerId: state.seerId || seerData.seerId,
                        epithet: state.epithet || seerData.epithet,
                        guise: state.guise || seerData.guise,
                        essence: seerData.essence,
                        currentEssence: seerData.currentEssence,
                        isCaster: seerData.isCaster,
                        hasUnveiled: seerData.hasUnveiled,
                    };
                }),

            sever: () =>
                set(() => ({
                    chamberId: null,
                    socketId: null,
                    essence: 0,
                    currentEssence: 0,
                    isCaster: false,
                    hasUnveiled: false,
                })),

            transmute: (updates) =>
                set((state) => ({
                    ...state,
                    ...updates,
                })),
        }),
        {
            name: "sketchbee:seer",
            partialize: (state) => ({
                seerId: state.seerId,
                epithet: state.epithet,
                guise: state.guise,
                essence: state.essence,
                chamberId: state.chamberId,
            }),
        }
    )
);
