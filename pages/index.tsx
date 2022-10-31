import Head from 'next/head'
import { ClientMain, ClientNavbar, ClientRouletteCard } from '../components'
import { AccountData, ClientRoulettes, Config, Websocket } from '../lib'
import { useContext, useState } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
interface RouletteData {
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
export default function Home() {
    const router = useRouter()
    const socket = useContext(Websocket)
    const { roulettes } = ClientRoulettes('all')
    const [roulettesData, setRouletteData] = useState<RouletteData[]>()
    const { account } = AccountData(Config.tgUser()?.id || process.env.NEXT_PUBLIC_HARD)
    useEffect(() => {
        if (!Config.tgUser() && process.env.NODE_ENV !== 'development') {
            router.push("404")
        }
    })
    //get roulettes
    const fetch = () => typeof window && socket.emit('roulettes', (res: RouletteData[]) => setRouletteData(res))
    //mouse and touch listener
    useEffect(() => {
        document.addEventListener('mousemove', fetch)
        document.addEventListener("touchstart", fetch)
        document.addEventListener('focusin', fetch)
    }, [])
    useEffect(() => {
        if (roulettes) setRouletteData(roulettes)
    }, [roulettes, setRouletteData])
    useEffect(() => {
        //ping send userid to server 
        socket.emit('ping', { id: Config.tgUser()?.id || process.env.NEXT_PUBLIC_HARD })
        //clean up
        return () => {
            socket.off('ping')
        }
    }, [])
    return (
        <>
            <Head>
                <title>TEAMDAO Spinning Wheel</title>
            </Head>
            {account ? (
                <>
                    <ClientNavbar
                        userid={account?.info?.id} />
                    <ClientMain>
                        <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-2'>
                            {roulettesData ? (
                                roulettesData.length > 0 ? (
                                    roulettesData.map((x, i) => (
                                        <Link key={i} href={`/roulette/${x.id}`} passHref>
                                            <a>
                                                <ClientRouletteCard
                                                    date={parseInt(moment(x.StartDate).format('x'))}
                                                    title={x.name}
                                                    maxParticipants={x.maxParticipants}
                                                    participants={x.participants.length} />
                                            </a>
                                        </Link>
                                    ))
                                ) : null
                            ) : null}
                        </div>
                    </ClientMain>
                </>
            ) : null}
        </>
    )
}