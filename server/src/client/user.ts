export class User {
    id: number = Math.floor(Math.random() * 1000);
    username: string = "Guest";
    type: "VOTER" | "HOST" = "VOTER";
    roomId: number = -1;

    constructor(name: string, type: "VOTER" | "HOST", roomId: number) {
        this.username = name;
        this.type = type;
        this.roomId = roomId
    }
}