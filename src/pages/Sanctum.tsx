import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SanctumNav from "../components/SanctumNav";
import SeerCircle from "../components/SeerCircle";
import Vellum from "../components/Vellum";
import Whispers from "../components/Whispers";
import Artifacts from "../components/Artifacts";
import ProphecyModal from "../components/ProphecyModal";

import useSocket from "../hooks/useSocket";
import useSeer from "../hooks/useSeer";
import useRitual from "../hooks/useRitual";
import useRitualTimer from "../hooks/useRitualTimer";

import { ISeer, Rites } from "../types";

const Sanctum: React.FC = () => {
    const navigate = useNavigate();

    const epithet = useSeer((state) => state.epithet);
    const guise = useSeer((state) => state.guise);
    const seerId = useSeer((state) => state.seerId);
    const chamberId = useSeer((state) => state.chamberId);
    const tether = useSeer((state) => state.tether);
    const sever = useSeer((state) => state.sever);

    const rite = useRitual((state) => state.rite);
    const omen = useRitual((state) => state.omen);
    const enigma = useRitual((state) => state.enigma);
    const setRite = useRitual((state) => state.setRite);
    const setSeers = useRitual((state) => state.setSeers);
    const setEnigma = useRitual((state) => state.setEnigma);
    const setOmen = useRitual((state) => state.setOmen);
    const setCasterSignature = useRitual((state) => state.setCasterSignature);
    const setUnveiledSeers = useRitual((state) => state.setUnveiledSeers);
    const setTerminus = useRitual((state) => state.setTerminus);
    const resetRitual = useRitual((state) => state.resetRitual);

    const secondsLeft = useRitualTimer();

    const { emit, subscribe } = useSocket();

    const [isListenersReady, setIsListenersReady] = useState(false);
    const [prophecyOptions, setProphecyOptions] = useState<string[] | null>([]);

    const handleChamberLeave = () => {
        emit("chamber:leave", { chamberId, seerId }, (response: any) => {
            if (response.ok) {
                console.log("sketchbee-log: left chamber successfully");
            } else {
                console.error("sketchbee-error: failed to leave chamber", response.message);
            }
        });
        sever();
        navigate("/");
    };

    const handleProphecySelection = (selectedWord: string) => {
        console.log("sketchbee-log: Choosing prophecy:", selectedWord);

        setEnigma(selectedWord);
        setProphecyOptions(null);

        emit("ritual:prophecy", { chamberId, casterId: seerId, prophecy: selectedWord }, (response: any) => {
            if (response.ok) {
                console.log("sketchbee-log: prophecy selection confirmed");
            } else {
                console.error("sketchbee-error: failed to select prophecy", response.message);
            }
        });
    };

    const onChamberSync = (data: { seers: ISeer[] }) => {
        console.log("sketchbee-log: chamber sync received: ", data.seers);

        setSeers(data.seers);
    };

    const onProphecyProvision = (data: { casterId: string; prophecies: string[] }) => {
        if (data.casterId !== seerId) {
            console.warn("sketchbee-warn: received prophecy options for different seer:", data.casterId);
            return;
        }

        console.log("sketchbee-log: Received prophecies:", data.prophecies);
        setProphecyOptions(data.prophecies);
    };

    const onRiteProgression = (data: { rite: Rites; message: string; casterId?: string; omen?: string; enigma?: string; unveiledSeers?: ISeer[]; terminus?: number }) => {
        console.log(`sketchbee-log: Entering Rite: ${data.rite} - ${data.message}`);

        setRite(data.rite);
        setTerminus(data.terminus ?? null);

        switch (data.rite) {
            case Rites.CONSECRATION:
                setCasterSignature(null);
                setOmen("");
                setEnigma("");
                setUnveiledSeers([]);
                if (!data.casterId) {
                    console.error("sketchbee-error: casterId is missing in CONSECRATION rite data");
                    return;
                }
                setCasterSignature(data.casterId);
                break;

            case Rites.DIVINATION:
                break;

            case Rites.MANIFESTATION:
                if (!data.omen) {
                    console.error("sketchbee-error: omen is missing in MANIFESTATION rite data");
                    return;
                }
                setOmen(data.omen);
                break;

            case Rites.REVELATION:
                if (!data.enigma) {
                    console.error("sketchbee-error: enigma is missing in REVELATION rite data");
                    return;
                }
                if (!data.unveiledSeers) {
                    console.error("sketchbee-error: seers are missing in REVELATION rite data");
                    return;
                }
                setEnigma(data.enigma);
                setUnveiledSeers(data.unveiledSeers);
                break;

            case Rites.DISSOLUTION:
                resetRitual();
                break;
        }
    };

    useEffect(() => {
        console.log("sketchbee-log: Initializing listeners...");

        const subscriptions = [subscribe("chamber:sync", onChamberSync), subscribe("ritual:prophecies", onProphecyProvision), subscribe("ritual:rite", onRiteProgression)];

        setIsListenersReady(true);

        return () => {
            subscriptions.forEach((unsubscribe) => unsubscribe());
            setIsListenersReady(false);
        };
    }, [subscribe, chamberId, seerId]);

    useEffect(() => {
        if (!epithet) {
            console.error("sketchbee-error: epithet is missing, redirecting to home");
            navigate("/");
        }

        if (!isListenersReady) {
            console.log("sketchbee-log: Listeners not ready, skipping chamber join");
            return;
        }

        emit("chamber:join", { epithet, guise, seerId, chamberId }, (response: { ok: boolean; message: string; seer: ISeer | null }) => {
            if (!response.ok) {
                console.error("sketchbee-error: failed to join chamber: ", response.message);

                sever();
                return navigate("/");
            }
            console.log("sketchbee-log: joined chamber %s as %s: ", response.seer!.chamberId, response.seer!.seerId);

            tether(response);
        });

        return () => {
            emit("chamber:leave", { chamberId, seerId }, (response: any) => {
                if (response.ok) {
                    console.log("sketchbee-log: left chamber successfully");
                } else {
                    console.error("sketchbee-error: failed to leave chamber", response.message);
                }
            });
            sever();
        };
    }, [subscribe, emit, isListenersReady]);

    return (
        <div className="min-h-screen w-full flex flex-col justify-between px-8 py-4 gap-5 bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-100 overflow-hidden font-serif scroll-smooth scrollbar-hide">
            <SanctumNav rite={rite} secondsLeft={secondsLeft} omen={omen} enigma={enigma} epithet={epithet} onLeave={handleChamberLeave} />

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[350px_1fr_350px] gap-6">
                <div className="order-2 sm:order-1 h-full min-h-[400px]">
                    <SeerCircle />
                </div>

                <div className="order-1 sm:order-2 h-full flex flex-col bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <Vellum />
                </div>

                <div className="order-3 sm:order-3 h-full min-h-[400px]">
                    <Whispers />
                </div>
            </div>

            <Artifacts />

            {rite === Rites.DIVINATION && prophecyOptions && prophecyOptions.length > 0 && (
                <ProphecyModal isOpen={!!prophecyOptions} prophecies={prophecyOptions} secondsLeft={secondsLeft} onSelect={handleProphecySelection} />
            )}
        </div>
    );
};

export default Sanctum;
