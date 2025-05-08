interface PrimaryButtonProps {
    text: string
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function Option ({ text, onClick } : PrimaryButtonProps) {
    return <div onClick={onClick} data-value={text} className="text-center m-2 p-2 w-fit rounded-md cursor-pointer bg-primary text-white min-w-40">
        {text}
    </div>
}