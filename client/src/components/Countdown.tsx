import { useEffect, useState } from "react"
import { WebSocketClient } from "../utils/WebSockets"

const ws = WebSocketClient.getClient()

export const Timer = ({ startTime, duration } : { startTime: number, duration: number }) => {

    const [timeLeft, setTimeLeft] = useState<number>(duration/1000)

    useEffect(() => {
    const timerInterval = setInterval(() => {
        if (!startTime) return;
        
        const now = Date.now()
        const timeRemaining = duration*1000 - (now - startTime)
        const secondsLeft = Math.max(0, Math.floor(timeRemaining / 1000))

        setTimeLeft(secondsLeft)

        if (timeRemaining <= 0) {
            const roomId = parseInt(localStorage.getItem("roomId") as string)
            ws.send(JSON.stringify({ msgType: "Time's up", roomId }))
            clearInterval(timerInterval)
        }
        
    }, 1000)}, [duration, startTime])

    return <>
        <div className="text-center text-xl font-bold text-gray-800 mt-4">
            {timeLeft > 0 ? `Time left: ${timeLeft} seconds` : "Time's up!"}
        </div>
    </>
}