import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import InputBox from "../components/InputBox"
import PrimaryButton from "../components/PrimaryButton"
import { WebSocketClient } from '../utils/WebSockets'
import toast, { Toaster } from "react-hot-toast"

export const Addquestion = () => {
    const [question, setQuestion] = useState<string>("")
    const [option1, setOption1] = useState<string>("")
    const [option2, setOption2] = useState<string>("")
    const [timer, setTimer] = useState<number>(60)

    const navigate = useNavigate()
    const { roomId } = useParams()
    const ws = WebSocketClient.getClient()
    
    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value)
    }

    const handleOption1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOption1(event.target.value)
    }

    const handleOption2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOption2(event.target.value)
    }

    const handleTimerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimer(parseInt(event.target.value))
    }

    const handleSubmit = () => {

        if (!question) {
            toast.error("Please enter a question.")
            return
        } else if (!option1) {
            toast.error("Please enter option 1")
            return
        } else if (!option2) {
            toast.error("Please enter option 2")
            return
        }

        const data = {
            question,
            option1,
            option2,
            roomId,
            timer
        }
        ws.send(JSON.stringify({ msgType: "Add Question", data, roomId }))
        navigate(`/room/${roomId}`)
    }

    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected to the server')
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.reason == "") {
                navigate(`/room/${roomId}`)
            } else if (data.reason == "Room does not exist") {
                toast.error("Room does not exist")
                navigate('/')
            } else if (data.reason == "User is not the host"){
                toast.error("User is not the host")
                navigate('/')
            }
        }

        ws.onclose = () => {
            console.log('Disconnected from the server')
        }
    }, [ws, roomId, navigate])

    return <>
        <Toaster/>
        <div className='flex flex-col items-center justify-center h-screen bg-dark'>
            <div className='bg-gradient-to-r from-primary to-secondary rounded-2xl h-fit p-2 shadow shadow-white'>
            <InputBox label={"Enter your Question"} type={"text"} placeholder={"Who is prime minister of India?"} onInput={handleQuestionChange} />
            <InputBox label={"Enter Option 1"} type={"text"} placeholder={"Narendra Modi"} onInput={handleOption1Change} />
            <InputBox label={"Enter Option 2"} type={"text"} placeholder={"Manmohan Singh"} onInput={handleOption2Change} />
            <InputBox label={"Enter Timer in seconds"} type={"text"} placeholder={"60"} onInput={handleTimerChange} />
            <PrimaryButton text={"Submit"} onClick={handleSubmit}/>
            <div className="text-white text-center">Room Id :- {roomId}</div>
            </div>
        </div>
    </>
}