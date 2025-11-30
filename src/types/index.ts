export type ToolType = "brush" | "eraser";

export interface ISigil {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

export enum ChamberPhase {
    GATHERING = "GATHERING",
    INVOKING = "INVOKING",
    MANIFESTING = "MANIFESTING",
    REVEALING = "REVEALING",
    SEALED = "SEALED",
}