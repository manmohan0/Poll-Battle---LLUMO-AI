"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(name, type, roomId) {
        this.id = Math.floor(Math.random() * 1000);
        this.name = "Guest";
        this.type = "VOTER";
        this.roomId = -1;
        this.name = name;
        this.type = type;
        this.roomId = roomId;
    }
}
exports.User = User;
