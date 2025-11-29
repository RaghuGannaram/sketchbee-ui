import { useEffect, useCallback } from "react";
import { io, type Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: false,
});

function useSocket() {
    useEffect(() => {
        const handleConnect = () => {
            console.info("sketchbee-info: socket %s connected via %s: ", socket.id, socket.io.engine?.transport.name);
        };

        const handleDisconnect = () => {
            console.info("sketchbee-info: socket disconnected");
        };

        const handleUpgrade = (transport: { name: string }) => {
            console.info("sketchbee-info: connection upgraded to: ", transport.name);
        };

        if (!socket.connected) {
            socket.connect();
        }

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        socket.io.engine.on("upgrade", handleUpgrade);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);

            socket.io.engine.off("upgrade", handleUpgrade);
        };
    }, []);

    const emit = useCallback(
        (eventName: string, data: any, ackCallback?: (response: any) => void): Promise<any> | void => {
            // if (!socket.connected) {
            //     console.warn("sketchbee-warn: socket not connected, cannot emit event:", eventName);
            //     return;
            // }

            if (ackCallback && typeof ackCallback === "function") {
                console.debug(`sketchbee-debug: (Ack Request)-${eventName} ==>`, data);

                socket.emit(eventName, data, (response: any) => {
                    console.debug(`sketchbee-debug: (Ack Response)-${eventName} <==`, response);
                    ackCallback(response);
                });
            } else {
                console.debug(`sketchbee-debug: (Fire & Forget)-${eventName} ==>`, data);
                socket.emit(eventName, data);
            }
        },
        []
    );

    const subscribe = useCallback((eventName: string, callback: (data: any) => void) => {
        const handler = (data: any) => {
            console.debug(`sketchbee-debug: (Event Received)-${eventName} <==`, data);
            callback(data);
        };

        socket.on(eventName, handler);

        return () => socket.off(eventName, handler);
    }, []);

    return { socket, emit, subscribe };
}

export default useSocket;
