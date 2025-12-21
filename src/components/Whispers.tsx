import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ShieldAlert, Target } from "lucide-react";
import useSeer from "../hooks/useSeer";
import useSocket from "../hooks/useSocket";

interface IWhisper {
    epithet: string;
    script: string;
    timestamp: number;
    isSystem?: boolean;
    isUnveiled?: boolean;
}

const Whispers: React.FC = () => {
    const { emit, subscribe } = useSocket();
    const epithet = useSeer((state) => state.epithet);
    const seerId = useSeer((state) => state.seerId);
    const chamberId = useSeer((state) => state.chamberId);

    const [draft, setDraft] = useState("");
    const [whispers, setWhispers] = useState<IWhisper[]>([]);
    const endOfScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSystemMessage = (data: { text: string }) => {
            setWhispers((prev) => [
                ...prev,
                {
                    epithet: "system",
                    script: data.text,
                    timestamp: Date.now(),
                    isSystem: true,
                    isUnveiled: false,
                },
            ]);
        };

        const unsubscribe = subscribe("sys:message", handleSystemMessage);

        return () => {
            unsubscribe();
        };
    }, [subscribe]);

    useEffect(() => {
        const handleNewWhisper = (data: IWhisper) => {
            setWhispers((prev) => [
                ...prev,
                {
                    epithet: data.epithet,
                    script: data.script,
                    timestamp: data.timestamp,
                    isSystem: false,
                    isUnveiled: false,
                },
            ]);
        };

        const unsubscribe = subscribe("rune:script", handleNewWhisper);

        return () => {
            unsubscribe();
        };
    }, [subscribe]);

    useEffect(() => {
        const unsubscribe = subscribe("rune:unveiled", (data) => {
            setWhispers((prev) => [
                ...prev,
                {
                    epithet: data.epithet,
                    script: data.script,
                    timestamp: data.timestamp,
                    isSystem: false,
                    isUnveiled: true,
                },
            ]);
        });
        return () => {
            unsubscribe();
        };
    }, [subscribe]);

    useEffect(() => {
        endOfScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [whispers]);

    const castWhisper = () => {
        if (!draft.trim()) return;
        const payload = { chamberId, seerId, epithet, script: draft };

        emit("rune:script", payload);

        setDraft("");
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-100 backdrop-blur-2xl border border-indigo-100 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-6 py-5 bg-slate-500/10 flex items-center gap-4">
                <MessageSquare className="w-4 h-4 text-indigo-400 stroke-[2.5px]" />
                <h2 className="font-mono font-bold text-slate-700 tracking-[0.2em] uppercase text-xs">Live Chat</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth scrollbar-hide">
                {whispers.map((whisper, index) => {
                    const isMe = whisper.epithet === epithet;

                    if (whisper.isUnveiled) {
                        return (
                            <div key={index} className="relative group py-4 animate-in fade-in zoom-in duration-700">
                                <div className="relative flex flex-col items-center">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Target className="w-4 h-4 text-indigo-500" />
                                        <span className="font-mono text-[10px] font-black text-indigo-500 tracking-widest uppercase">{whisper.epithet} got it...!!!</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    if (whisper.isSystem) {
                        return (
                            <div key={index} className="flex justify-center items-center gap-2 py-2">
                                <div className="h-px flex-1 bg-slate-200" />
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-200/50 rounded-full border border-slate-200">
                                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500 stroke-2 " />
                                    <span className="font-mono text-[10px] text-slate-700 font-bold tracking-widest uppercase">{whisper.script}</span>
                                </div>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>
                        );
                    }

                    return (
                        <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {!isMe && <span className="text-[8px] font-mono font-bold text-slate-700 tracking-widest uppercase ml-1">{whisper.epithet}</span>}

                            <div className={`px-4 py-2 rounded-xl ${isMe ? "bg-slate-900 text-slate-200 rounded-tr-none " : "bg-slate-200 text-slate-700 rounded-tl-none"}`}>
                                <p className="text-[13px] font-serif leading-snug tracking-wide italic">{whisper.script}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={endOfScrollRef} />
            </div>

            <div className="relative group">
                <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && castWhisper()}
                    placeholder="Type your message...."
                    className="w-full p-4 bg-slate-200 placeholder:text-slate-400 text-sm font-serif italic text-slate-900 focus:outline-none focus:ring-0"
                />
                <button
                    onClick={castWhisper}
                    disabled={!draft.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 flex items-center justify-center group-focus-within:text-indigo-500 rounded-md"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Whispers;
