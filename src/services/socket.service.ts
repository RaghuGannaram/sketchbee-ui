import { io, type Socket } from "socket.io-client";

export const socketInstance: Socket = io(`http://${window.location.hostname}:5000`, {
	autoConnect: false,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});
