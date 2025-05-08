export class User {
    id: number = Math.floor(Math.random() * 1000);
    name: string = "Guest";
    type: "VOTER" | "HOST" = "VOTER";
    roomId: number = -1;

    constructor(name: string, type: "VOTER" | "HOST", roomId: number) {
        this.name = name;
        this.type = type;
        this.roomId = roomId
    }
}