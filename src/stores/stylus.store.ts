import { createStore } from "zustand/vanilla";
import { persist, devtools } from "zustand/middleware";

type ToolMode = "etch" | "rub";

export interface IStylusState {
    gauge: number;
    pigment: string;
    tip: ToolMode;

    snapshots: string[];
    pointer: number;
}

export interface IStylusActions {
    setGauge: (size: number) => void;
    setPigment: (color: string) => void;
    setTip: (tool: ToolMode) => void;

    anchor: (dataURL: string) => void;
    revoke: () => string | null;
    invoke: () => string | null;
    banish: () => void;
}

export interface IStylusStore extends IStylusState, IStylusActions {}

export const stylusStore = createStore<IStylusStore>()(
    devtools(
        persist(
            (set, get) => ({
                gauge: 5,
                pigment: "#82c65d",
                tip: "etch",
                snapshots: [],
                pointer: -1,

                setGauge: (size) => set({ gauge: size }),
                setPigment: (color) => set({ pigment: color }),
                setTip: (tool) => set({ tip: tool }),

                anchor: (dataURL) =>
                    set((state) => {
                        const past = state.snapshots.slice(0, state.pointer + 1);
                        const updated = [...past, dataURL];

                        return {
                            snapshots: updated,
                            pointer: updated.length - 1,
                        };
                    }),

                invoke: () => {
                    const { pointer, snapshots } = get();
                    if (pointer >= snapshots.length - 1) return null;

                    const newPointer = pointer + 1;
                    set({ pointer: newPointer });

                    return snapshots[newPointer];
                },

                revoke: () => {
                    const { pointer, snapshots } = get();
                    if (pointer < 0) return null;

                    const newPointer = pointer - 1;
                    set({ pointer: newPointer });

                    return newPointer === -1 ? null : snapshots[newPointer];
                },

                banish: () => {
                    set({
                        snapshots: [],
                        pointer: -1,
                    });

                    return null;
                },
            }),
            {
                name: "sketchbee:stylus",
                partialize: (state) => ({
                    gauge: state.gauge,
                    pigment: state.pigment,
                    tip: state.tip,
                }),
            }
        )
    )
);
