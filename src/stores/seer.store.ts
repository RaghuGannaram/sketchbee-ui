import { createStore } from "zustand/vanilla";
import { persist, devtools } from "zustand/middleware";

export interface ISeerState {
    seerId: string | null;
    socketId: string | null;
    chamberId: string | null;

    epithet: string;
    guise: string;

    essence: number;
    currentEssence: number;
}

export interface ISeerActions {
    incarnate: (epithet: string, guise?: string) => void;
    tether: (data: any) => void;
    sever: () => void;
    transmute: (updates: Partial<ISeerState>) => void;
}

export interface ISeerStore extends ISeerState, ISeerActions {}

const INITIAL_STATE: ISeerState = {
    seerId: null,
    socketId: null,
    chamberId: null,
    epithet: "",
    guise: "",
    essence: 0,
    currentEssence: 0,
};

export const seerStore = createStore<ISeerStore>()(
    devtools(
        persist(
            (set) => ({
                ...INITIAL_STATE,

                incarnate: (epithet) =>
                    set((_state) => ({
                        epithet,
                        guise: `https://api.dicebear.com/7.x/notionists/svg?seed=${epithet}`,
                    })),

                tether: (response) =>
                    set((_state) => {
                        const seerData = response.seer;
                        return {
                            seerId: seerData.seerId,
                            socketId: seerData.socketId,
                            chamberId: seerData.chamberId,
                            epithet: seerData.epithet,
                            guise: seerData.guise,
                            essence: seerData.essence,
                            currentEssence: seerData.currentEssence,
                        };
                    }),

                sever: () =>
                    set(() => ({
                        socketId: null,
                        chamberId: null,
                        essence: 0,
                        currentEssence: 0,
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
                    epithet: state.epithet,
                    guise: state.guise,
                }),
            }
        )
    )
);
