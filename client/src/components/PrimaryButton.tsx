interface PrimaryButtonProps {
    text: string
    onClick: () => void
}

export default function PrimaryButton ({ text, onClick } : PrimaryButtonProps) {
    return <div onClick={onClick} className="m-2 p-2 w-fit rounded-md cursor-pointer bg-primary text-white">
        {text}
    </div>
}