import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { ControlMain, ControlNavbar, ManLoader, ControlRouletteParticipant, ControlRouletteCreateNewPaticipant, ControlRouletteSettings } from '../../../components'
import dbConnect from '../../../lib/Db/connect'
import { Roulette } from '../../../models'
import { useState, useContext, useEffect } from 'react'
import { ControlWs } from '../../../lib'
import { FaPlus, FaCog } from 'react-icons/fa'
interface RouletteInterface {
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    StartDate: string,
    startRoulette: boolean,
    maxParticipants: number,
    isDone: boolean,
    participants: {
        id: string,
        userid: string,
        created: string
    }[],
    created: string
}
type RouletteTypes = {
    data: {
        id: string,
        autoStart: boolean,
        name: string,
        prize: string,
        StartDate: string,
        startRoulette: boolean,
        maxParticipants: number,
        isDone: boolean,
        participants: {
            id: string,
            userid: string,
            created: string
        }[],
        created: string
    }
}
type RouletteData = {
    data: string
}
export default function RouletteID(props: RouletteData) {
    const socket = useContext(ControlWs)
    const [roulette, SetRoulette] = useState<RouletteInterface>(JSON.parse(props.data))
    const [createParticipant, SetCreateParticipant] = useState(false)
    const [rouletteSettings, SetrouletteSettings] = useState(false)
    useEffect(() => {
        //join to roulette room
        socket.emit('join-roulette-room', { id: roulette.id })
        //new roulette data
        socket.on('roulette-data', (new_data: RouletteTypes) => {
            if (new_data.data.id === roulette.id) SetRoulette(new_data.data)
        })
        //clean up 
        return () => {
            socket.off('join-roulette-room')
            socket.off('roulette-data')
        }
    }, [])
    const get_roulette_data = () => {

    }
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
                        <div className="flex gap-1.5 items-center">
                            <button
                                onClick={() => SetCreateParticipant(true)}
                                className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                <div className="flex gap-2 items-center py-1 md:py-0">
                                    <FaPlus className="w-4 h-4" />
                                    <span className="hidden md:block transition-all">New Participant</span>
                                </div>
                            </button>
                            <button
                                onClick={() => SetrouletteSettings(true)}
                                className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                <div className="flex gap-2 items-center py-1 md:py-0">
                                    <FaCog className="w-4 h-4" />
                                    <span className="hidden md:block transition-all">Settings</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="transition-all grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {roulette.participants.map((x, i) => (
                            <ControlRouletteParticipant
                                key={i}
                                image={`/api/profile/${x.userid}`}
                                userid={x.userid}
                                created={'fasfaf'} />
                        ))}
                    </div>
                </div>
            </ControlMain>
            <ControlRouletteSettings
                socket={socket}
                get_roulette_data={get_roulette_data}
                roulette={roulette}
                open={rouletteSettings}
                closeModal={() => SetrouletteSettings(false)} />
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