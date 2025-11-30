import React, { createContext } from "react";
import { type Socket } from "socket.io-client";
import useSocketLifecycle from "../hooks/core/useSocketLifecycle";

interface ISocketContext {
    socket: Socket;
    emit: (eventName: string, data: any, ackCallback?: (res: any) => void) => void;
    subscribe: (eventName: string, callback: (data: any) => void) => () => void;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket, emit, subscribe } = useSocketLifecycle();

    return <SocketContext.Provider value={{ socket, emit, subscribe }}>{children}</SocketContext.Provider>;
};
