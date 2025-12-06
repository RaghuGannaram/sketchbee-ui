export type ToolType = "brush" | "eraser";

export interface ISigil {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

// ==========================================
// THE PROGRESSION OF THE SACRED RITE
// ==========================================

export const RitualPhase = {
    /**
     * Stage 1: The Lobby.
     * Seers are joining the circle. The bond is forming.
     * Waiting for the Host to start the Rite.
     */
    CONGREGATION: "RITUAL_CONGREGATION",

    /**
     * Stage 2: Selection.
     * The Caster is consulting the Grimoire.
     * The system presents 3 "Prophecies" (Options).
     * The Caster must choose one to become the "Enigma".
     */
    DIVINATION: "RITUAL_DIVINATION",

    /**
     * Stage 3: The Summoning (Countdown).
     * The Enigma has been chosen, but the channel is not yet open.
     * A brief moment (3-5s) for the Caster to prepare and Seers to focus.
     */
    INVOCATION: "RITUAL_INVOCATION",

    /**
     * Stage 4: Gameplay (Acting & Guessing).
     * The Channel is open. Time is flowing.
     * The Caster manifests the Enigma physically.
     * The Seers attempt to divine the truth.
     */
    MANIFESTATION: "RITUAL_MANIFESTATION",

    /**
     * Stage 5: Round End.
     * The Enigma is revealed to all (whether solved or time ran out).
     * Spirit Energy (Points) is awarded.
     * A brief pause before the next Caster is chosen.
     */
    REVELATION: "RITUAL_REVELATION",

    /**
     * Stage 6: Game Over.
     * The Max Cycles have been reached.
     * The Grimoire is closed.
     * The final hierarchy of Seers is etched into history.
     */
    SEALED: "RITUAL_SEALED",
} as const;

// Helper type for TypeScript safety
export type RitualPhaseType = (typeof RitualPhase)[keyof typeof RitualPhase];
