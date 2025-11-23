class WebSocketService {
    private socket: WebSocket | null = null;

    connect(url: string) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    send(event: string, data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ event, data }));
        }
    }

    onMessage(callback: (event: MessageEvent) => void) {
        if (this.socket) {
            this.socket.onmessage = callback;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

const websocketService = new WebSocketService();
export default websocketService;
