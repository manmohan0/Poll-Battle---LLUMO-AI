import express from 'express';
import WebSocket from 'ws';
import { ExtendedWebSocket, IQuestion } from './types';
import { User } from './client/user';
import CORS from 'cors'

const app = express()

app.use(CORS({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

const server = app.listen(8080)
const wss = new WebSocket.Server({ server })

let users: User[] = []
const rooms: Map<number, User> = new Map()
const questions: Map<number, IQuestion> = new Map()
const CastedVotes: Map<number, Set<string>> = new Map()
const createdAt: Map<number, number> = new Map()

wss.on('connection', (ws: WebSocket) => {

  const client = ws as unknown as ExtendedWebSocket
  
  ws.on('message', (message) => {
    const msg = JSON.parse(message.toString())
    
    msg.roomId = parseInt(msg.roomId)

    if (msg.msgType === 'Join Room') {

      if (!rooms.has(msg.roomId)) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room not found", roomId: msg.roomId }) 
        return ws.send(replyMsg)
      }
      
      const user = new User(msg.name, msg.type, msg.roomId)
      client.roomId = msg.roomId
      client.username = msg.name
      users.push(user)

      const replyMsg = JSON.stringify({ success: true, reason: "Room Joined", roomId: msg.roomId, user, createdAt: createdAt.get(msg.roomId) })
      return ws.send(replyMsg)

    } else if (msg.msgType === 'Create Room') {

      const roomId = Math.floor(Math.random() * 1000)
      client.roomId = roomId
      client.username = msg.name
      
      if (rooms.get(roomId)) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room already exists", roomId })
        return ws.send(replyMsg)
      }
      
      const user = new User(msg.name, msg.type, roomId)
      
      users.push(user)
      rooms.set(roomId, user)

      const replyMsg = JSON.stringify({ success: true, reason: 'Room Created',  roomId: roomId, user })
      return ws.send(replyMsg)

    } else if (msg.msgType === 'Add Question') {
     
      const roomId = msg.roomId
      const user = rooms.get(roomId)

      if (!rooms.get(roomId)) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room does not exist" })
        return ws.send(replyMsg)
      }
      
      if (!user) {
        const replyMsg = JSON.stringify({ success: false, reason: "User is not the host" })
        return ws.send(replyMsg)
      }

      const roomQuestion = { question: msg.data.question, option1: msg.data.option1, option2: msg.data.option2, option1Vote: 0, option2Vote: 0 }
      questions.set(roomId, roomQuestion)

      createdAt.set(roomId, Date.now())

      const replyMsg = JSON.stringify({ success: true, reason: "" })
      return ws.send(replyMsg)
    } else if (msg.msgType == "get Question") {
      
      const roomId = msg.roomId
      const question = questions.get(roomId)

      if (!question) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room not found" })
        return ws.send(replyMsg)
      }
      
      const replyMsg = JSON.stringify({ success: true, reason: "", data: question, createdAt: createdAt.get(roomId), option1Vote: question.option1Vote, option2Vote: question.option2Vote, total: question?.option1Vote + question?.option2Vote })
      return ws.send(replyMsg)

    } else if (msg.msgType == "Cast Vote") {

      const selectedOption = msg.selectedOption
      const roomQuestion = questions.get(parseInt(msg.roomId))
      
      if (!roomQuestion) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room not found" })
        return ws.send(replyMsg)
      }

      let voters = CastedVotes.get(msg.roomId)
      
      if (!voters) {
        voters = new Set<string>()
        CastedVotes.set(msg.roomId, voters)
      }

      if (voters.has(msg.user)) {
        const replyMsg = JSON.stringify({ success: false, reason: "User can cast vote only once" })
        return ws.send(replyMsg)
      }
      if (roomQuestion.option1 == selectedOption) {
        roomQuestion.option1Vote++
      } else if (roomQuestion.option2 == selectedOption) {
        roomQuestion.option2Vote++
      }
      voters.add(msg.user)
      
      CastedVotes.set(msg.roomId, voters)
      questions.set(msg.roomId, roomQuestion)
      
      const replyMsg = JSON.stringify({ success: true, reason: "", option1Vote: roomQuestion.option1Vote, option2Vote: roomQuestion.option2Vote, total: roomQuestion.option1Vote + roomQuestion.option2Vote, user: msg.user })

      return  wss.clients.forEach(client => {
        const c = client as unknown as ExtendedWebSocket;
        if (client.readyState === WebSocket.OPEN && c.roomId == msg.roomId) {
          client.send(replyMsg)
        }
      })

    } else if (msg.msgType == "Time's up") {

      const roomQuestion = questions.get(msg.roomId)

      if (!roomQuestion) {
        const replyMsg = JSON.stringify({ success: false, reason: "Room not found" })
        return ws.send(replyMsg)
      }

      ws.send(JSON.stringify({ success: true, reason: "Time's up", option1Vote: roomQuestion.option1Vote, option2Vote: roomQuestion.option2Vote, total: roomQuestion.option1Vote + roomQuestion.option2Vote }))

      users = users.filter(user => user.roomId !== msg.roomId)

      rooms.delete(msg.roomId)
      questions.delete(msg.roomId)
      CastedVotes.delete(msg.roomId)
      createdAt.delete(msg.roomId)

      if (!rooms.has(msg.roomId)){
        const replyMsg = JSON.stringify({ success: true, reason: "Room deleted", option1Vote: roomQuestion.option1Vote, option2Vote: roomQuestion.option2Vote, total: roomQuestion.option1Vote + roomQuestion.option2Vote })
        return ws.send(replyMsg)
      }
    }

  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})