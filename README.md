# Setup Instructions
## 1. Frontend (React.js)
- Navigate to the `client` folder:

    ```bash 
    cd client
    ```
- Install dependencies using:

    ```bash
    npm install
    ```
- Now start the `react js server`:

    ```bash 
    npm run dev
    ```
- Now your frontend is started on:

    [http://localhost:5173](http://localhost:5173)

## 2. Backend (Node.js + WebSocket)
- On new terminal, navigate to the `server` folder:

    ```bash
    cd server
    ```
- Install dependencies:

    ```bash
    npm install
    ```
- Now start the `Node.js server` using

    ```bash
    npm run dev
    ```
- Now your backend is running

## Using Docker
- In the root directory:
  
    ```bash
    docker-compose up
    ```

# Features
## Frontend (React.js)
- Users enter their name (unique, no password) and either:
    - Create a new poll room, or
    - Join an existing poll room using a room code.
- A question and its two options are displayed.
- Users can vote for one option only once.
- Users can see their votes in realtime.
- Host can set a countdown for the room (default 60 sec) and when it ends, room is disbanded.
- Maximum votes option will highlight with green color and minimum votes option will highlight with red colour. When votes are equal, both options will highlight in yellow colour.

## Backend (Node.js + WebSocket)
- Multiple users can create different rooms
- Votes are broadcasted to only the users in the room
- Poll state is stored in-memory for faster updates

---
# Description on State sharing and room management

## State sharing
- I have extended the class `WebSocket` to add username (for future use) and roomId.
- This roomId is used to identify the user in the room uniquely.
- When the state updates, we share the state of room to all the users by find the users in the room using `roomId == user.roomId`

## Room management
### Room Creation:
- When the new room is created, the user (host) is inserted in `Users` array and `rooms` Map where `roomId` is mapped to the `user (host)`.
- If new `roomId` generated already exists in `rooms` Map, then `roomId` is generated again.
    - Metadata of the room, such as `createdAt`, is generated.
### Room Joining:
- When `username` or `roomId` entered by user is found in `Users` array or `rooms` Map, If a user with same username exist in the room with roomId entered, a pop-up notifies the user about it.

- Relavent metadata of the room is sent 
### Room Deletion:
- On timeout, all the data related to the room is deleted from memory 
- Clients are notified by server
- New users are prevented from joining the room
