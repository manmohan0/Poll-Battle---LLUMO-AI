export interface IQuestion {
    question: string;
    option1: string;
    option2: string;
    option1Vote: number;
    option2Vote: number;
}

export interface ExtendedWebSocket extends WebSocket {
    roomId?: number
    username?: string
  }