import { useEffect, useState } from "react"

interface OptionProps {
    text : string,
    optionVote : number, 
    total : number
}
export default function Option ({ text, optionVote, total } :  OptionProps) {

    const [color, setColor] = useState<"bg-green-400" | "bg-red-400" | "bg-yellow-400">("bg-yellow-400")

    useEffect(() => {
        if (optionVote / total > 0.5) {
            setColor("bg-green-400")
        } else if (optionVote / total < 0.5) {
            setColor("bg-red-400")
        } else {
            setColor("bg-yellow-400")
        }
    }, [optionVote, total])

    return <div data-value={text} className={`relative flex m-2 h-12 rounded-md bg-gray-500 text-white min-w-40 cursor-not-allowed`}>
        <div className={`${color} absolute flex items-center justify-between h-full p-2 rounded-md`} style={{ width: `${optionVote/total * 100}%` }}>
        </div>
        <div className="relative z-10 flex w-full items-center justify-between h-full px-4">
            <span className="whitespace-nowrap">{text}</span>
            <span className="whitespace-nowrap">{`${(optionVote / total * 100).toFixed(2)} %`}</span>
        </div>
    </div>
}