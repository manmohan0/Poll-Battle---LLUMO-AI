import { useEffect, useState } from "react";
import { WebSocketClient } from "../utils/WebSockets";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import PrimaryButton from "../components/PrimaryButton";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
    
    const [name, setName] = useState<string>("")
    const [roomId, setRoomId] = useState<string>("")

    const ws = WebSocketClient.getClient()
    const navigate = useNavigate()

    useEffect(() => {
      localStorage.clear()
    }, [])

    useEffect(() => {
    
      ws.onopen = () => {
        console.log('Connected to the server')
      } 
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onmessage = (event) => {
        if (!name) return toast.error("Name cannot be empty")
          
        const data = JSON.parse(event.data)
        
        if (data.reason === "Room Created") {
          if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("roomId", JSON.stringify(data.roomId))
          }

          navigate(`/room/${data.roomId}/Addquestion`)
        } else if (data.reason === "Room not found") {
          toast.error("Room not found")
        } else if (data.reason == "Room already exists"){
          toast.error("Room already exists")
        } else if (data.reason === "Room Joined") {
          if (!localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(data.user))
            localStorage.setItem("roomId", JSON.stringify(data.roomId))
          }

          navigate(`/room/${data.roomId}`)
        } 
      }

      ws.onclose = () => {
        console.log('Disconnected from the server')
      }

      return () => {
        
      }

    }, [name, navigate, ws])
    
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    }
  
    const handleRoomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoomId(event.target.value)
    }

    const handleSubmit = () => {
      if (!name) {
        toast.error("Name cannot be empty")
        return
      }

      if (roomId) {
        ws.send(JSON.stringify({ name, type: "VOTER", msgType: "Join Room", roomId }));
      } else {
        ws.send(JSON.stringify({ name, type: "HOST", msgType: "Create Room" }));
      }
    }
    
    return <>
      <Toaster/>
      <div className='flex flex-col items-center justify-center h-screen bg-dark'>
          <div className='bg-gradient-to-r from-primary to-secondary rounded-2xl h-fit p-2 shadow shadow-white'>
          <InputBox label={"Enter your name"} type={"text"} placeholder={"Type your name here"} onInput={handleNameChange} />
          <InputBox label={"Enter your room ID"} type={"text"} placeholder={"Keep empty to create new room"} onInput={handleRoomIdChange} />
          <PrimaryButton text={"Submit"} onClick={handleSubmit}/>
          </div>
      </div>
    </>
}