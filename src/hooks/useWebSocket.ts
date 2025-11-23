import { useEffect, useRef } from "react";

function useWebSocket(url: string, onMessage: (event: MessageEvent) => void) {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onmessage = onMessage;

        socket.onopen = () => {
            console.log("sketchbee-log: WebSocket connected");
        };

        socket.onclose = () => {
            console.log("sketchbee-log: WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, [url, onMessage]);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return { sendMessage };
}

export default useWebSocket;
