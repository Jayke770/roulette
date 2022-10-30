import Countdown from "react-countdown"
import CountUp from "react-countup"
type RouletteCard = {
    date: number,
    title: string,
    participants: number,
    maxParticipants: number
}
export default function RouletteCard(props: RouletteCard) {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>Raffle Ended</span>
        } else {
            return <span className='text-base text-center dark:text-primary font-bold uppercase'>{days}D {hours}:{minutes}:{seconds}</span>
        }
    }
    return (
        <div className="p-4 flex flex-col gap-1.5 cursor-pointer dark:hover:bg-green-primary/20 bg-zinc-800 rounded-lg shadow-lg">
            <div className='text-base font-normal'>{props.title}</div>
            <div className='flex justify-between items-baseline'>
                <span className='font-light dark:text-zinc-400'>Participants</span>
                <div className='flex gap-2'>
                    <CountUp
                        start={0}
                        end={props.participants} />
                    <span>/</span>
                    <CountUp
                        className='dark:text-teamdao-primary'
                        start={0}
                        end={props.maxParticipants} />
                </div>
            </div>
            <div className='flex justify-between items-baseline'>
                <span className='font-light dark:text-zinc-400'>Starting in</span>
                {isNaN(props.date) ? <span>N/A</span> : <Countdown date={props.date} renderer={renderer} />}
            </div>
        </div>
    )
}