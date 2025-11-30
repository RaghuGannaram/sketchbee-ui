import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("socketContext must be used within a SocketProvider");
    }
    return {
        socketId: context.socket.id,
        isConnected: context.socket.connected,
        emit: context.emit,
        subscribe: context.subscribe,
    };
};

export default useSocket;