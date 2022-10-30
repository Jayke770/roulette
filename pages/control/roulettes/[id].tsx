import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { ControlMain, ControlNavbar, ManLoader, ControlRouletteParticipant, ControlRouletteCreateNewPaticipant, ControlRouletteSettings, ControlRou, ControlRouletteChatRecieved, ControlRouletteChatSent } from '../../../components'
import dbConnect from '../../../lib/Db/connect'
import { Roulette } from '../../../models'
import { useState, useContext, useEffect } from 'react'
import { Color, ControlWs } from '../../../lib'
import { FaPlus, FaCog } from 'react-icons/fa'
import { Tab } from '@headlessui/react'
import dynamic from 'next/dynamic'
import _Dialog from '../../../components/Dialog'
import Swal from 'sweetalert2'
import { FaPaperPlane } from 'react-icons/fa'
import { useRef } from 'react'
const Wheel = dynamic(
    () => import('react-custom-roulette').then(mod => mod.Wheel),
    { ssr: false, loading: () => <span>Loading</span> }
)
interface RouletteData {
    data: {
        id: string,
        autoStart: boolean,
        name: string,
        prize: string,
        StartDate: string,
        maxParticipants: number,
        isDone: boolean,
        startRoulette: boolean,
        winner: number,
        participants: {
            id: string,
            userid: string,
            created: string
        }[],
        created: string
    },
    roulette: {
        option: string,
        id: string,
        style: {
            backgroundColor: string,
            textColor: string
        }
    }[]
}
type RouletteDataProps = {
    data: any,
    roulette: any
}
export default function RouletteID(props: RouletteDataProps) {
    const socket = useContext(ControlWs)
    const [chatData, setChatData] = useState({
        open: false
    })
    const [roulette, SetRoulette] = useState<RouletteData>({
        data: JSON.parse(props.data),
        roulette: JSON.parse(props.roulette)
    })
    const [createParticipant, SetCreateParticipant] = useState(false)
    const [tab, setTab] = useState('info')
    const [rouletteSettings, SetRouletteSettings] = useState({
        isLoading: false
    })
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        message: '',
        icon: 'success'
    })
    useEffect(() => {
        //join to roulette room
        socket.emit('join-roulette-room', { id: roulette.data.id })
        //new roulette data
        socket.on('roulette-data', (new_data: RouletteData) => {
            if (new_data.data.id === roulette.data.id) SetRoulette(new_data)
        })
        //clean up 
        return () => {
            socket.off('join-roulette-room')
            socket.off('roulette-data')
        }
    }, [])
    const _get_roulette_data = (): void => {
        socket.emit('roulette-data', { id: roulette.data.id }, (res: RouletteData) => SetRoulette(res))
    }
    const _start_roulette = (): void => {
        if (!roulette.data.startRoulette && !rouletteSettings.isLoading) {
            Swal.fire({
                icon: 'question',
                title: 'Start Roulette',
                text: 'Are you sure you want to start this roulette.',
                backdrop: true,
                allowOutsideClick: false,
                confirmButtonText: 'Yes',
                showDenyButton: true,
                reverseButtons: true,
                position: 'bottom',
                showClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeInUp ms-300'
                },
                hideClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeOutDown ms-300'
                }
            }).then((a) => {
                if (a.isConfirmed) {
                    SetRouletteSettings({ ...rouletteSettings, isLoading: true })
                    Swal.fire({
                        toast: true,
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        title: 'Starting Roulette',
                        position: 'bottom-right',
                        showClass: {
                            popup: 'animate__animated animate__fadeInUp ms-300'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutDown ms-300'
                        },
                        willOpen: () => {
                            Swal.showLoading()
                            try {
                                //start roulette 
                                socket.emit('start-roulette', { id: roulette.data.id }, (res: { status: boolean, title: string, message: string }) => {
                                    SetRouletteSettings({ ...rouletteSettings, isLoading: false })
                                    Swal.fire({
                                        toast: true,
                                        icon: res.status ? 'success' : 'info',
                                        backdrop: true,
                                        timer: 2000,
                                        timerProgressBar: true,
                                        allowOutsideClick: false,
                                        showConfirmButton: false,
                                        title: res.title,
                                        position: 'bottom-right',
                                        showClass: {
                                            popup: 'animate__animated animate__fadeInUp ms-300'
                                        },
                                        hideClass: {
                                            popup: 'animate__animated animate__fadeOutDown ms-300'
                                        },
                                    })
                                })
                            } catch (e) {
                                SetRouletteSettings({ ...rouletteSettings, isLoading: true })
                                setDialog({ ...dialog, open: true, title: 'Connection Error', message: e.message, icon: 'error' })
                            }
                        },
                    })
                }
            })
        }
    }
    const chat = (): void => {
        setChatData({ ...chatData, open: !chatData.open })
        document.querySelector('#chats').scrollTop = document.querySelector('#chats').scrollHeight
    }
    return (
        <>
            <Head>
                <title>{roulette ? roulette.data.name : 'Roulette Not Found'}</title>
            </Head>
            <ControlNavbar
                page={roulette.data.name} />
            <ControlMain>
                <div className='px-2 md:px-0 -mt-2 mb-2 w-full md:w-96'>
                    <Tab.Group>
                        <Tab.List className="flex gap-1 space-x-1 rounded-xl bg-zinc-800 p-1">
                            <Tab
                                onClick={() => setTab('info')}
                                className={`w-full ${tab === 'info' ? 'dark:bg-teamdao-primary dark:text-black' : 'bg-transparent'} transition-all rounded-lg py-2.5 text-sm font-medium leading-5 ring-white dark:ring-teamdao-primary ring-opacity-60 ring-offset-2 ring-offset-blue-400  dark:ring-offset-zinc-800 focus:outline-none focus:ring-2`}>
                                Information
                            </Tab>
                            <Tab
                                onClick={() => setTab('roulette')}
                                className={`w-full ${tab === 'roulette' ? 'dark:bg-teamdao-primary dark:text-black' : 'bg-transparent'} transition-all rounded-lg py-2.5 text-sm font-medium leading-5 ring-white dark:ring-teamdao-primary ring-opacity-60 ring-offset-2 ring-offset-blue-400  dark:ring-offset-zinc-800 focus:outline-none focus:ring-2`}>
                                Roulette
                            </Tab>
                        </Tab.List>
                    </Tab.Group>
                </div>
                {tab === 'info' && (
                    <div className="animate__animated animate__fadeIn ms-300 flex flex-col gap-3 p-2 md:p-0 !pb-10">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                                <input
                                    type={'search'}
                                    placeholder="Search"
                                    className="bg-zinc-800 lg:w-96 rounded-lg border-none transition-all outline-none dark:focus:ring-teamdao-primary font-normal" />
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
                                    className="bg-teamdao-primary/80 transition-all hover:bg-teamdao-primary px-4 py-2 dark:text-black rounded-lg shadow-lg font-semibold text-base">
                                    <div className="flex gap-2 items-center py-1 md:py-0">
                                        <FaCog className="w-4 h-4" />
                                        <span className="hidden md:block transition-all">Settings</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="transition-all grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {roulette.data.participants.map((x, i) => (
                                <ControlRouletteParticipant
                                    key={i}
                                    socket={socket}
                                    image={`/api/profile/${x.userid}`}
                                    userid={x.userid}
                                    created={'fasfaf'} />
                            ))}
                        </div>
                    </div>
                )}
                {tab === 'roulette' && (
                    <div className="animate__animated animate__fadeIn ms-300 flex flex-col justify-center items-center overflow-hidden gap-3 p-2 md:p-0 !pb-10">
                        <div className='flex flex-col lg:flex-row justify-center items-center gap-3 w-full mt-5'>
                            <div className='relative'>
                                <Wheel
                                    mustStartSpinning={roulette.data.isDone ? false : roulette.data.startRoulette}
                                    prizeNumber={roulette.data.winner}
                                    data={roulette.roulette}
                                    outerBorderWidth={10}
                                    innerBorderColor={'green'}
                                    fontSize={13}
                                    textDistance={40}
                                    spinDuration={1.0}
                                />
                                {!roulette.data.isDone && (
                                    <div className='absolute w-full h-full top-0 flex justify-center items-center z-50'>
                                        <button
                                            onClick={_start_roulette}
                                            className='w-14 h-14 rounded-full dark:bg-teamdao-primary/80 dark:text-black outline-none font-bold'>Start</button>
                                    </div>
                                )}
                            </div>
                            <div className='w-full flex justify-center items-center px-4'>
                                <div className='p-4 dark:bg-zinc-800 w-full md:w-96 shadow-lg rounded-lg'>
                                    {roulette.data.isDone && roulette.data.winner ? (
                                        <>
                                            <div className='text-lg'>Roulette Winner</div>
                                            <div className='flex flex-col gap-1.5 mt-2'>
                                                <div className='flex items-baseline justify-between'>
                                                    <div className='font-light'>Userid:</div>
                                                    <div>{roulette.data.participants[roulette.data.winner].userid}</div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='text-center'>Roulette is not yet done</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ControlMain>
            <div className='fixed z-50 bottom-0 right-0 md:right-2 w-full md:w-[400px] shadow-md border border-zinc-800 rounded-t-xl transition-all'>
                <div
                    onClick={chat}
                    className='px-3.5 py-2.5 dark:bg-zinc-800 transition-all rounded-t-xl cursor-pointer'>
                    <div className='text-lg font-semibold'>Roulette Chats</div>
                </div>
                <div className={`${chatData.open ? 'h-[70vh]' : 'h-0'} flex flex-col transition-all dark:bg-zinc-900`}>
                    <div id='chats' className='flex flex-col overflow-auto gap-3 flex-[85%] w-full p-2'>
                        <ControlRouletteChatRecieved
                            username='@rwrqw'
                            message='fhasfjfhjaf fasjfhjs fasufhsafasf fjasfhsafhjasf \n fasfh' />
                        <ControlRouletteChatSent
                            message='faskfkfsaf fajhfas fjafaf fsafasfa fsajfhaf fsajfhsafa sfasfuas fafasfsafsafjsaf fsafassa' />
                        <ControlRouletteChatRecieved
                            username='@rwrqw'
                            message='fsa fasfa' />
                    </div>
                    <div className="flex flex-[10%] p-2 translucent">
                        <div className='relative w-full flex justify-center items-center'>
                            <textarea
                                placeholder='Message'
                                className='resize-none text-sm min-h-[70px] dark:text-zinc-300 w-full dark:bg-zinc-800 outline-none border-none rounded-lg pr-10 dark:focus:ring-1 dark:focus:ring-teamdao-secondary transition-all'>
                                fghfhsa
                            </textarea>
                            <FaPaperPlane
                                className='absolute right-3 top-3 w-6 h-6' />
                        </div>
                    </div>
                </div>
            </div>
            <ControlRouletteCreateNewPaticipant
                _get_roulette_data={_get_roulette_data}
                rouletteID={roulette.data.id}
                open={createParticipant}
                closeModal={() => SetCreateParticipant(false)} />
            <_Dialog
                open={dialog.open}
                onClose={() => setDialog({ ...dialog, open: false })}
                title={dialog.title}
                message={dialog.message}
                backdrop={false}
                showCancelButton={true}
                icon={dialog.icon} />
        </>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USERLOGGED = await getSession(ctx)
    if (USERLOGGED) {
        const ROULETTE_DATA = await Roulette.findOne({ id: ctx.query['id'] })
        if (ROULETTE_DATA) {
            //modify participants array 
            let new_participants_data: any[] = []
            ROULETTE_DATA.participants.map((x) => {
                new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
            })
            return {
                props: {
                    roulette: JSON.stringify(new_participants_data),
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