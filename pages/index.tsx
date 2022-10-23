import Head from 'next/head'
import { ClientMain, ClientNavbar, ClientRouletteCard } from '../components'
import { ClientRoulettes, Websocket } from '../lib'
import { useContext } from 'react'
import Link from 'next/link'
import moment from 'moment'
export default function Home() {
    const socket = useContext(Websocket)
    const { roulettes } = ClientRoulettes(socket)
    return (
        <>
            <Head>
                <title>TEAMDAO Spinning Wheel</title>
            </Head>
            <ClientNavbar />
            <ClientMain>
                <div className='h-[calc(100vh-100px)] overflow-auto'>
                    <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[calc(100vh-64px)] p-2'>
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
                </div>
            </ClientMain>
        </>
    )
}