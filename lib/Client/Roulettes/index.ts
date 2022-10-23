import { Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'
interface Roulette {
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    StartDate: string,
    maxParticipants: number,
    isDone: boolean,
    participants: {
        id: string,
        userid: string,
        created: string
    }[],
}
export default function Roulettes(socket: Socket) {
    const [data, setData] = useState<Roulette[]>()
    useEffect(() => {
        fetch()
        document.addEventListener('mousemove', fetch)
        document.addEventListener("touchstart", fetch)
        document.addEventListener('focusin', fetch)
        //clean up 
        return () => {
            document.removeEventListener('mousemove', fetch, false)
            document.removeEventListener('touchstart', fetch, false)
            document.removeEventListener('focusin', fetch, false)
        }
    }, [])
    const fetch = () => socket.emit('roulettes', (res: any) => setData(res))
    return { roulettes: data }
}