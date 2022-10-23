import CountUp from "react-countup"
type rouletteCard = {
    title: string,
    participants: number,
    prize: string,
    status: boolean
}
export default function RoulettteCard(props: rouletteCard) {
    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-[.97] dark:hover:bg-green-primary/50">
            <div className="text-base font-normal">{props.title}</div>
            <div className="flex flex-col gap-2 mt-1">
                <div className="flex justify-between items-baseline">
                    <span className="dark:text-zinc-400 text-sm">Participants</span>
                    <CountUp
                        start={0}
                        end={props.participants}
                        className="text-zinc-300 text-sm" />
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="dark:text-zinc-400 text-sm">Status</span>
                    {props.status ? <span className="text-sm font-normal text-red-500">Done</span> : <span className="text-sm font-normal text-teal-500">Ongoing</span>}
                </div>
            </div>
        </div>
    )
}