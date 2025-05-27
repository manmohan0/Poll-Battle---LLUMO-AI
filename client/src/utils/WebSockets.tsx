export class WebSocketClient {
    private static instance: WebSocketClient;
    private socket: WebSocket;

    private constructor(){
        const isProduction = import.meta.env.MODE === 'production';
        const wsURL = isProduction ? import.meta.env.VITE_WEBSOCKET_URL : `ws://${window.location.hostname}:8080`;
        this.socket = new WebSocket(wsURL);
    }

    public static getClient() {
        if (!this.instance) {
            this.instance = new WebSocketClient();  
        }
        return this.instance.socket;
    }
}