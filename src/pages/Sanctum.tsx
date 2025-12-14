import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import SeerCircle from "../components/SeerCircle";
import Vellum from "../components/Vellum";
import Whispers from "../components/Whispers";
import Artifacts from "../components/Artifacts";

import useSocket from "../hooks/useSocket";
import useSeer from "../hooks/useSeer";
import useRitual from "../hooks/useRitual";

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
    const enigma = useRitual((state) => state.enigma);
    const setRite = useRitual((state) => state.setRite);
    const setEnigma = useRitual((state) => state.setEnigma);
    const setOmen = useRitual((state) => state.setOmen);
    const setCasterSignature = useRitual((state) => state.setCasterSignature);
    const setUnveiledSeers = useRitual((state) => state.setUnveiledSeers);
    const resetRitual = useRitual((state) => state.resetRitual);

    const { emit, subscribe } = useSocket();

    useEffect(() => {
        if (!epithet) {
            navigate("/");
        }
    }, [epithet]);

    useEffect(() => {
        emit("chamber:join", { epithet, guise, seerId, chamberId }, (response: { ok: boolean; message: string; seer: ISeer | null }) => {
            if (!response.ok) {
                console.error("sketchbee-error: failed to join chamber: ", response.message);

                sever();
                return navigate("/");
            }
            console.log("sketchbee-log: joined chamber %s as %s: ", response.seer!.chamberId, response.seer!.seerId);

            tether(response);
        });
    }, []);

    useEffect(() => {
        const handleRiteProgression = (data: { rite: Rites; message: string; casterId?: string; omen?: string; enigma?: string; unveiledSeers?: ISeer[]; timeLeftMs?: number }) => {
            console.log(`sketchbee-log: Entering Rite: ${data.rite} - ${data.message}`);

            setRite(data.rite);

            switch (data.rite) {
                case Rites.CONSECRATION:
                    if (!data.casterId) {
                        console.error("sketchbee-error: casterId is missing in CONSECRATION rite data");
                        return;
                    }
                    setCasterSignature(data.casterId);
                    setOmen("");
                    setEnigma("");
                    setUnveiledSeers([]);
                    break;

                case Rites.DIVINATION:
                    break;

                case Rites.MANIFESTATION:
                    if (data.omen) setOmen(data.omen);
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

        const unsubscribe = subscribe("ritual:rite", handleRiteProgression);

        return () => {
            unsubscribe();
        };
    }, [subscribe, setRite, setCasterSignature, setEnigma, setOmen]);

    useEffect(() => {
        const handleProphecySelection = (data: { casterId: string; prophecies: string[] }) => {
            if (data.casterId !== seerId) return;

            //TODO : ask user to select a prophecy
            alert("Select a prophecy: " + data.prophecies.join(", "));

            emit("ritual:prophecy", { chamberId: chamberId, casterId: seerId, prophecy: data.prophecies[0] }, (response: any) => {
                if (response.ok) {
                    console.log("sketchbee-log: prophecy selected: ", data.prophecies[0]);

                    setEnigma(data.prophecies[0]);
                } else {
                    console.error("sketchbee-error: failed to select prophecy: ", response.message);
                }
            });
        };

        const unsubscribe = subscribe("ritual:prophecies", handleProphecySelection);

        return () => {
            unsubscribe();
        };
    }, [chamberId, seerId, subscribe]);

    return (
        <div className="min-h-screen w-full flex flex-col px-12 py-2 bg-linear-to-br from-yellow-100 via-amber-50 to-orange-100 overflow-hidden">
            <nav className="h-16 flex justify-between items-center">
                <span className="flex items-center gap-2 text-yellow-700 font-semibold text-lg">
                    <button onClick={() => navigate("/")} className="p-1 bg-white rounded-full shadow-md hover:bg-yellow-50 transition-all">
                        <ArrowLeft className="text-yellow-600 w-5 h-5" />
                    </button>
                    Back
                </span>
                <div>
                    {rite === Rites.CONGREGATION && <span>Phase: Congregation</span>}
                    {rite === Rites.CONSECRATION && <span>Phase: Consecration</span>}
                    {rite === Rites.DIVINATION && <span>Phase: Divination</span>}
                    {rite === Rites.MANIFESTATION && <span>Phase: Manifestation</span>}
                    {rite === Rites.REVELATION && <span>Phase: Revelation</span>}
                    {rite === Rites.DISSOLUTION && <span>Phase: Dissolution</span>}
                </div>
                {enigma && <span className="text-yellow-700 font-semibold text-lg">Prophecy: {enigma}</span>}
                <span>Omi</span>
            </nav>

            <div className="flex-1 grid gap-4 grid-cols-1 grid-rows-[auto_auto_auto_auto] sm:grid-cols-[minmax(180px,1fr)_minmax(500px,3fr)_minmax(250px,1fr)] sm:grid-rows-1 ">
                <div className="sm:col-span-1 order-1 sm:order-0">
                    <SeerCircle />
                </div>

                <div className="sm:col-span-1 order-2 sm:order-0 rounded-xl shadow-lg border border-yellow-200 ">
                    <Vellum />
                </div>

                <div className="sm:col-span-1 order-3 sm:order-0">
                    <Whispers />
                </div>
            </div>

            <div className="h-32">
                <Artifacts />
            </div>
        </div>
    );
};

export default Sanctum;
