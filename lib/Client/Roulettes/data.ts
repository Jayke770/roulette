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
export default function RouletteData(socket: Socket, id: string) {
    const [data, setData] = useState<Roulette>()
    const fetch = () => socket.emit('roulette-data', (res: any) => setData(res))
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
    return { roulettes: data }
}