interface OptionProps {
    text : string,
    optionVote : number, 
    total : number
}
export default function Option ({ text, optionVote, total } :  OptionProps) {

    return <div data-value={text} className={`text-center m-2 w-fit rounded-md bg-gray-500 text-white min-w-40 cursor-not-allowed`}>
        <div className="bg-blue-500 h-full p-2 rounded-md" style={{ width: `${optionVote/total * 100}%` }}>
            {text}
        </div>
    </div>
}