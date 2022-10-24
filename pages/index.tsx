import Head from 'next/head'
import { ClientMain, ClientNavbar, ClientRouletteCard } from '../components'
import { ClientRoulettes, Config, Websocket } from '../lib'
import { useContext } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
const hard = "1391502332"
export default function Home() {
    const router = useRouter()
    const socket = useContext(Websocket)
    const { roulettes } = ClientRoulettes(socket)
    // useEffect(() => {
    //     if (!Config.tgUser()) {
    //         router.push("404")
    //     }
    // })
    useEffect(() => {
        //ping send userid to server 
        socket.emit('ping', { id: hard })
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
            <ClientNavbar />
            <ClientMain>
                <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 p-2'>
                    {roulettes ? (
                        roulettes.length > 0 ? (
                            roulettes.map((x, i) => (
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
                        ) : <span>empty</span>
                    ) : <span>Loading</span>}
                </div>
            </ClientMain>
        </>
    )
}