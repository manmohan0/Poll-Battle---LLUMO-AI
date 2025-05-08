export class WebSocketClient {
    private static instance: WebSocketClient;
    private socket: WebSocket;

    private constructor(){
        this.socket = new WebSocket("ws://localhost:8080");
    }

    public static getClient() {
        if (!this.instance) {
            this.instance = new WebSocketClient();  
        }
        return this.instance.socket;
    }
}