import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { ControlMain, ControlNavbar, ManLoader, ControlRouletteParticipant, ControlRouletteCreateNewPaticipant } from '../../../components'
import dbConnect from '../../../lib/Db/connect'
import { Roulette } from '../../../models'
import { useState, useContext, useEffect } from 'react'
import { ControlWs } from '../../../lib'
import { FaPlus, FaCog } from 'react-icons/fa'
interface RouletteTypes {
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
    created: string
}
type RouletteData = {
    data: string
}
const card = Array.from({ length: 40 })
export default function RouletteID(props: RouletteData) {
    const socket = useContext(ControlWs)
    const [roulette, SetRoulette] = useState<RouletteTypes>(JSON.parse(props.data))
    const [createParticipant, SetCreateParticipant] = useState(false)
    useEffect(() => {
        //join to roulette room
        socket.emit('join-roulette-room', { id: roulette.id })
        //clean up 
        return () => {
            socket.off('join-roulette-room')
        }
    }, [])
    return (
        <>
            <Head>
                <title>{roulette ? roulette.name : 'Roulette Not Found'}</title>
            </Head>
            <ControlNavbar
                page={roulette.name} />
            <ControlMain>
                <div className="flex flex-col gap-3 p-2 md:p-0 !pb-40">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <input
                                type={'search'}
                                placeholder="Search"
                                className="bg-zinc-800 rounded-lg border-none transition-all outline-none dark:focus:ring-teamdao-primary font-normal" />
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => SetCreateParticipant(true)}
                                className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                <div className="flex gap-2 items-center py-1 md:py-0">
                                    <FaPlus className="w-4 h-4" />
                                    <span className="hidden md:block transition-all">New Participant</span>
                                </div>
                            </button>
                            <button
                                className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                <div className="flex gap-2 items-center py-1 md:py-0">
                                    <FaCog className="w-4 h-4" />
                                    <span className="hidden md:block transition-all">Settings</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="transition-all grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {card.map((_, i) => (
                            <ControlRouletteParticipant
                                key={i}
                                image={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                                userid={'fsaf'}
                                created={'fasfaf'} />
                        ))}
                    </div>
                </div>
            </ControlMain>
            <ControlRouletteCreateNewPaticipant
                rouletteID={roulette.id}
                open={createParticipant}
                closeModal={() => SetCreateParticipant(false)} />
        </>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USERLOGGED = await getSession(ctx)
    if (USERLOGGED) {
        await dbConnect()
        const ROULETTE_DATA = await Roulette.findOne({ id: ctx.query['id'] })
        if (ROULETTE_DATA) {
            return {
                props: {
                    data: JSON.stringify(ROULETTE_DATA)
                }
            }
        } else {
            return {
                props: {},
                redirect: {
                    destination: '/471241284'
                }
            }
        }
    } else {
        return {
            props: {},
            redirect: {
                destination: '/api/auth/signin?callbackUrl=%2Fcontrol'
            }
        }
    }
}