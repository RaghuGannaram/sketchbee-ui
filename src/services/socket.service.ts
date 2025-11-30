import { io, type Socket } from "socket.io-client";

export const socketInstance: Socket = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});
