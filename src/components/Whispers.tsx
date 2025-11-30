import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Scroll } from "lucide-react";
import useSeer from "../hooks/useSeer";
import useSocket from "../hooks/useSocket";

interface IWhisper {
    epithet: string;
    script: string;
    isSystem: boolean;
    timestamp: number;
}

const Whispers: React.FC = () => {
    const [draft, setDraft] = useState("");
    const [whispers, setWhispers] = useState<IWhisper[]>([]);
    const { emit, subscribe } = useSocket();
    const epithet = useSeer((state) => state.epithet);
    const chamberId = useSeer((state) => state.chamberId);
    const endOfScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleNewWhisper = (data: IWhisper) => {
            setWhispers((prev) => [...prev, data]);
        };

        const unsubscribe = subscribe("rune:script", handleNewWhisper);

        return () => {
            unsubscribe();
        };
    }, [subscribe]);

    useEffect(() => {
        endOfScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [whispers]);

    const castWhisper = () => {
        if (!draft.trim()) return;

        const payload = {
            chamberId,
            epithet,
            script: draft,
        };

        emit("rune:script", payload);

        setDraft("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            castWhisper();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white/60 backdrop-blur-sm rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-yellow-100/50 border-b border-yellow-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-700" />
                <h2 className="font-serif font-bold text-yellow-900 tracking-wide">Whispers</h2>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {whispers.length === 0 && (
                    <div className="text-center text-gray-400 italic text-sm mt-10">
                        <Scroll className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        The void is silent...
                    </div>
                )}

                {whispers.map((msg, index) => {
                    const isMe = msg.epithet === epithet;

                    return (
                        <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {/* Author Name (Only show for others) */}
                            {!isMe && (
                                <span className="text-[10px] text-gray-500 mb-1 ml-1 uppercase tracking-wider font-semibold">
                                    {msg.epithet}
                                </span>
                            )}

                            {/* Bubble */}
                            <div
                                className={`
                                max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm
                                ${
                                    isMe
                                        ? "bg-yellow-500 text-white rounded-tr-none"
                                        : "bg-white border border-yellow-100 text-gray-800 rounded-tl-none"
                                }
                            `}
                            >
                                {msg.script}
                            </div>
                        </div>
                    );
                })}
                <div ref={endOfScrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/80 border-t border-yellow-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Chant your guess..."
                        className="flex-1 bg-yellow-50/50 border border-yellow-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all placeholder:text-yellow-700/30 text-gray-800"
                    />
                    <button
                        onClick={castWhisper}
                        disabled={!draft.trim()}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Whispers;
