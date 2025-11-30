import React, { useState, useEffect } from "react";
import useSeer from "../hooks/useSeer";
import useSocket from "../hooks/useSocket";

const ChatWindow: React.FC = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ epithet: string; text: string }[]>([]);
    const socket = useSocket();
    const epithet = useSeer((state) => state.epithet);

    useEffect(() => {
        // if (!socket) return;

        // const handleChatMessage = (data: { epithet: string; text: string }) => {
        //     setMessages((prevMessages) => [...prevMessages, data]);
        // };

        // socket.on("chat_message", handleChatMessage);

        // return () => {
        //     socket.off("chat_message", handleChatMessage);
        // };
    }, [socket]);

    const sendMessage = () => {
        if (!message.trim() || !socket) return;

        const chatMessage = { epithet: epithet || "Anonymous", text: message };
        socket.emit("chat_message", chatMessage);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.epithet}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
