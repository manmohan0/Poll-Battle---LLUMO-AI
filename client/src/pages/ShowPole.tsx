import toast, { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { WebSocketClient } from "../utils/WebSockets"
import { useParams } from "react-router-dom"
import Option from "../components/Option"
import type { Question } from "../types"
import DisabledOption from "../components/DisabledOption"
import { Timer } from "../components/Countdown"

export const ShowPole = () => {

    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined)
    const [roomId, setRoomId] = useState<string>()
    const [jointime, setJoinTime] = useState<number>(0)
    const [option1Vote, setOption1Vote] = useState<number>(0)
    const [option2Vote, setOption2Vote] = useState<number>(0)
    const [totalVote, setTotalVote] = useState<number>(0)
    const [isVotingClosed, setIsVotingClosed] = useState(false);

    const [question, setQuestion] = useState<Question>({
        question: "",
        option1: "",
        option2: ""
    })

    const ws = WebSocketClient.getClient()
    
    const params = useParams()

    useEffect(() => {        
        if (!roomId) return 

        if (!localStorage.getItem(`timeleft${roomId}`)) {
            const jointime = Date.now().toString()
            localStorage.setItem(`timeleft${roomId}`, jointime.toString())
            setJoinTime(parseInt(jointime))
        } else {
            const jointime = localStorage.getItem(`timeleft${roomId}`) as string
            setJoinTime(parseInt(jointime))
        }
    }, [params.roomId])

    useEffect(() => {
        setRoomId(params.roomId)
    }, [params.roomId])

    useEffect(() => {
        const option = localStorage.getItem(`selectedOption${roomId}`) as string
        if (!selectedOption && option) {
            setSelectedOption(option)
        }
    }, [params.roomId, ws])

    useEffect(() => {
        if (selectedOption) {
            const user = localStorage.getItem("user")
            if (user) {
                ws.send(JSON.stringify({ msgType: "Cast Vote", selectedOption, roomId: params.roomId, user }))
            }
        }
    }, [selectedOption, ws])

    useEffect(() => {
        const roomId = Number(params.roomId?.toString() ?? "")
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ msgType: "get Question", roomId }))
        }
    }, [ws])

    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected to the server')
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        ws.onmessage = (event) => {

            const data = JSON.parse(event.data)

            if (data.data) {
                setQuestion(data.data)
                setJoinTime(data.createdAt)
                setOption1Vote(data.option1Vote)
                setOption2Vote(data.option2Vote)
                setTotalVote(data.total)
                return
            } else if (data.reason === "Room not found") {
                toast.error("Room not found")
            } else if (data.reason === "Time's up" || data.reason === "Room deleted") {
                setOption1Vote(data.option1Vote)
                setOption2Vote(data.option2Vote)
                setTotalVote(data.total)
                setSelectedOption(undefined); 
                setIsVotingClosed(true)
                return
            } else if (data.reason === "User can cast vote only once") {
                toast.error("You have already cast your vote")
            } else if (data.reason === "") {
                setOption1Vote(data.option1Vote)
                setOption2Vote(data.option2Vote)
                setTotalVote(data.total)
                if (data.user === localStorage.getItem("user")) {
                    toast.success("Vote casted successfully")
                }
            }


        }
        
        ws.onclose = () => {
            console.log('Disconnected from the server')
        }
        
    }, [ws])

    const handleSelectOption = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedOption) {
            const option = e.currentTarget.getAttribute("data-value") as string
            localStorage.setItem(`selectedOption${roomId}`, option)
            setSelectedOption(option)
        }
    }

    return <>
        <Toaster/>
        <div className='flex flex-col items-center justify-center h-screen bg-dark'>
            <div className='flex flex-col items-center bg-gradient-to-r from-primary to-secondary rounded-2xl h-fit p-2 shadow shadow-white min-w-lg'>
                <Timer startTime={jointime as number} duration={60}/>
                <div className="text-white font-bold">
                    Q. {question.question}
                </div>
                {selectedOption || isVotingClosed ? <DisabledOption text={question.option1} optionVote={option1Vote} total={totalVote}/> : <Option text={question.option1} onClick={handleSelectOption}/>}
                {selectedOption || isVotingClosed ? <DisabledOption text={question.option2} optionVote={option2Vote} total={totalVote}/> : <Option text={question.option2} onClick={handleSelectOption}/>}
                {!isVotingClosed && (<><span className=" text-white">Room Id :- {params.roomId}</span></>)}
            </div>
        </div>
    </>
}