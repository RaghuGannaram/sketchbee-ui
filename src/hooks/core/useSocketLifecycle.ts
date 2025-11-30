import { useEffect, useCallback } from "react";
import { socketInstance } from "../../services/socket.service";

function useConnection() {
    useEffect(() => {
        const handleConnect = () => {
            console.info(
                "sketchbee-info: socket %s connected via %s: ",
                socketInstance.id,
                socketInstance.io.engine?.transport.name
            );
        };

        const handleDisconnect = () => {
            console.info("sketchbee-info: socket disconnected");
        };

        const handleUpgrade = (transport: { name: string }) => {
            console.info("sketchbee-info: connection upgraded to: ", transport.name);
        };

        if (!socketInstance.connected) {
            socketInstance.connect();
        }

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);
        socketInstance.io.engine.on("upgrade", handleUpgrade);

        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            socketInstance.io.engine.off("upgrade", handleUpgrade);
        };
    }, []);

    const emit = useCallback(
        (eventName: string, data: any, ackCallback?: (response: any) => void): Promise<any> | void => {
            if (ackCallback && typeof ackCallback === "function") {
                console.debug(`sketchbee-debug: (Ack Request)-${eventName} ==>`, data);

                socketInstance.emit(eventName, data, (response: any) => {
                    console.debug(`sketchbee-debug: (Ack Response)-${eventName} <==`, response);
                    ackCallback(response);
                });
            } else {
                console.debug(`sketchbee-debug: (Fire & Forget)-${eventName} ==>`, data);
                socketInstance.emit(eventName, data);
            }
        },
        []
    );

    const subscribe = useCallback((eventName: string, callback: (data: any) => void) => {
        const handler = (data: any) => {
            console.debug(`sketchbee-debug: (Event Received)-${eventName} <==`, data);
            callback(data);
        };

        socketInstance.on(eventName, handler);

        return () => socketInstance.off(eventName, handler);
    }, []);

    return { socket: socketInstance, emit, subscribe };
}

export default useConnection;
