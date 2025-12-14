export enum Rites {
    CONGREGATION = "CONGREGATION",
    CONSECRATION = "CONSECRATION",
    DIVINATION = "DIVINATION",
    MANIFESTATION = "MANIFESTATION",
    REVELATION = "REVELATION",
    DISSOLUTION = "DISSOLUTION",
}

export interface ISeer {
    seerId: string;
    socketId: string;
    chamberId?: string;
    epithet: string;
    guise: string;
    essence: number;
    currentEssence: number;
}

export interface ISigil {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

export type ToolType = "brush" | "eraser";
