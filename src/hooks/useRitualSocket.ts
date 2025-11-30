// src/hooks/useChamberEvents.ts
import { useEffect, useCallback } from "react";
import { useSocket } from "./useSocket"; // The Public Guard Hook
import { useSlateStore } from "../stores/slate.store";
import { useSeerStore } from "../stores/seer.store";
import { 
    ISigil, 
    ChamberPhase, 
    ISeer 
} from "../types/arcane.types";

export const useChamberEvents = (chamberId: string) => {
    // 1. Network Layer
    const { socket, emit, subscribe } = useSocket();

    // 2. State Layer (Actions only to avoid re-renders)
    const { 
        setPhase, 
        setEnigma, 
        setOmen, 
        addSigil, 
        wipeSlate, 
        updateSeer,
        syncChamberState 
    } = useSlateStore.getState();

    const myEpithet = useSeerStore(s => s.epithet);

    // ==================================================
    // A. INBOUND LISTENERS (Hearing the Ritual)
    // ==================================================
    useEffect(() => {
        if (!socket.connected) return;

        console.log("sketchbee-log: Attuning to Chamber Events...");

        // --- 1. SYNC (The Initial Download) ---
        const unsubSync = subscribe("CHAMBER_SYNC", (fullState: any) => {
            console.log("sketchbee-log: Chamber State Synchronized", fullState);
            syncChamberState(fullState);
        });

        // --- 2. POPULATION (Seers Entering/Leaving) ---
        const unsubJoin = subscribe("SEER_ENTERED", (seer: ISeer) => {
            // Add or Update the Seer in the Slate
            updateSeer(seer);
        });

        // --- 3. FLOW (Phase Changes) ---
        const unsubPhase = subscribe("PHASE_SHIFT", (payload: { phase: ChamberPhase, expiry: number }) => {
            setPhase(payload.phase);
            // We also sync the timer here usually
            useSlateStore.setState({ fluxExpiry: payload.expiry });
        });

        // --- 4. MANIFESTATION (Drawing) ---
        const unsubSigil = subscribe("SIGIL_CAST", (sigil: ISigil) => {
            // Only add if it's not our own (Optimization: we draw our own instantly)
            if (sigil.casterId !== socket.id) {
                addSigil(sigil);
            }
        });

        const unsubBanish = subscribe("BANISH_ALL", () => {
            wipeSlate();
        });

        // --- 5. REVELATION (Hints & Answers) ---
        const unsubOmen = subscribe("OMEN_REVEALED", (newOmen: string) => {
            setOmen(newOmen);
        });

        const unsubReveal = subscribe("ENIGMA_REVEALED", (enigma: string) => {
            setEnigma(enigma);
        });

        // --- 6. CHAT/GUESSES ---
        // Assuming SlateStore has a chat log or a separate ChatStore
        const unsubScript = subscribe("SCRIPT_CAST", (msg: any) => {
             // Logic to push to chat array
             // useSlateStore.getState().addScript(msg);
        });

        // Cleanup: Break the link when component unmounts
        return () => {
            unsubSync();
            unsubJoin();
            unsubPhase();
            unsubSigil();
            unsubBanish();
            unsubOmen();
            unsubReveal();
            unsubScript();
        };
    }, [subscribe, socket.connected]);


    // ==================================================
    // B. OUTBOUND HANDLERS (Performing Magic)
    // ==================================================

    /**
     * Broadcast a drawing line to other Seers
     */
    const broadcastSigil = useCallback((sigil: ISigil) => {
        // 1. Optimistic UI: Draw it locally immediately
        addSigil(sigil);
        
        // 2. Send to Server
        emit("CAST_SIGIL", { chamberId, sigil });
    }, [emit, chamberId]);

    /**
     * Clear the canvas for everyone (Caster only)
     */
    const broadcastBanish = useCallback(() => {
        wipeSlate();
        emit("BANISH_ALL", { chamberId });
    }, [emit, chamberId]);

    /**
     * Send a Chat message or Guess
     */
    const castScript = useCallback((text: string) => {
        emit("CAST_SCRIPT", { 
            chamberId, 
            text, 
            sender: myEpithet 
        });
    }, [emit, chamberId, myEpithet]);

    /**
     * Caster chooses the word to draw
     */
    const invokeProphecy = useCallback((word: string) => {
        emit("INVOKE_PROPHECY", { chamberId, word });
    }, [emit, chamberId]);

    return {
        broadcastSigil,
        broadcastBanish,
        castScript,
        invokeProphecy
    };
};