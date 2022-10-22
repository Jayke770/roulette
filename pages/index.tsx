import Head from 'next/head'
import { ClientNavbar } from '../components'
const cards = Array.from({ length: 20 })
export default function Home() {
    return (
        <>
            <Head>
                <title>TEAMDAO Spinning Wheel</title>
            </Head>
            <ClientNavbar />
            <div className='flex flex-col gap-2.5 h-[calc(100vh-64px)] overflow-auto p-2'>
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="p-4 translucent bg-zinc-900 rounded-lg shadow-lg">
                        fsafj
                    </div>
                ))}
            </div>
        </>
    )
}