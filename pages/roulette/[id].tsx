import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Websocket from '../../lib/Client/Ws'
import { Config, AccountData } from '../../lib'
import Head from 'next/head'
import { Background, ClientRouletteChatRecieved, ClientRouletteChatSent, Confetti } from '../../components'
import { GetServerSideProps } from 'next'
import { Roulette } from '../../models'
import { useRouter } from 'next/router'
import { FaComments, FaArrowLeft, FaPaperPlane } from 'react-icons/fa'
import { RiLoader5Fill } from 'react-icons/ri'
import Link from 'next/link'
import Swal from 'sweetalert2'
import _Dialog from '../../components/Dialog'
const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false, loading: () => <span>Loading</span> }
)
interface RouletteDataTypes {
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
      option: string,
      created: string,
      removed: boolean,
      style: {
        backgroundColor: string
      }
    }[],
    created: string
  },
  participants: {
    id: string,
    userid: string,
    option: string,
    created: string,
    removed: boolean,
    style: {
      backgroundColor: string
    }
  }[]
}
interface Message {
  isSending: boolean,
  message: string
}
interface RouletteSettings {
  start: boolean,
  selected: number | null
}
export default function RouletteData(props: { data: any, participants: any }) {
  const router = useRouter()
  const socket = useContext(Websocket)
  const [showConfetti, setshowConfetti] = useState(false)
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    icon: 'success'
  })
  const [message, setMessage] = useState<Message>({
    isSending: false,
    message: ''
  })
  const [rouletteSettings, SetRouletteSettings] = useState<RouletteSettings>({
    start: false,
    selected: null
  })
  const [WheelData, setWheelData] = useState<RouletteDataTypes>({
    data: JSON.parse(props.data),
    participants: JSON.parse(props.participants)
  })
  const { account } = AccountData((Config.tgUser())?.id || process.env.NEXT_PUBLIC_HARD)
  useEffect(() => {
    if (!Config.tgUser() && process.env.NODE_ENV !== 'development') {
      router.push("404")
    }
  })
  const chat_open = (): void => {
    const div = document.querySelector("#main-msg")
    //remove animate out animation 
    const animate_out: string[] = div.attributes.getNamedItem('animate-out').value.split(' ')
    animate_out.map(x => div.classList.remove(x))
    //add animate in animation
    const animate_in: string[] = div.attributes.getNamedItem('animate-in').value.split(' ')
    animate_in.map(x => div.classList.add(x))
    document.querySelector('#main-wrapper-msg').classList.remove('hidden')
    document.querySelector('#main-wrapper-msg').classList.add('flex')
    document.querySelector('#chats').scrollTop = document.querySelector('#chats').scrollHeight
  }
  const chat_close = (): void => {
    const div = document.querySelector("#main-msg")
    //remove animate in animation 
    const animate_in: string[] = div.attributes.getNamedItem('animate-in').value.split(' ')
    animate_in.map(x => div.classList.remove(x))
    //add animate in animation
    const animate_out: string[] = div.attributes.getNamedItem('animate-out').value.split(' ')
    animate_out.map(x => div.classList.add(x))
    setTimeout(() => {
      document.querySelector('#main-wrapper-msg').classList.remove('flex')
      document.querySelector('#main-wrapper-msg').classList.add('hidden')
    }, 300)
  }
  const join_roulette = (): void => {
    if (!WheelData.participants.find(x => x.userid === account.info.id)) {
      Swal.fire({
        icon: 'question',
        titleText: 'Join Roulette',
        text: 'Are you sure you want to join this roulette',
        backdrop: true,
        allowOutsideClick: false,
        showDenyButton: true,
        confirmButtonText: 'Join',
        denyButtonText: 'Cancel',
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
          Swal.fire({
            icon: 'info',
            titleText: 'Joining Roulette',
            text: 'Please Wait...',
            backdrop: true,
            allowEnterKey: false,
            showConfirmButton: false,
            position: 'bottom',
            showClass: {
              backdrop: '!p-0 bg-black/80',
              popup: 'animate__animated animate__fadeInUp ms-300'
            },
            hideClass: {
              backdrop: '!p-0 bg-black/80',
              popup: 'animate__animated animate__fadeOutDown ms-300'
            },
            willOpen: async () => {
              Swal.showLoading()
              const req = await fetch('/api/roulette/join', {
                method: 'post',
                headers: {
                  'content-type': 'application/json'
                },
                body: JSON.stringify({ userid: account.info.id, rouletteID: WheelData.data.id })
              })
              if (req.ok) {
                const { status, title, message } = await req.json()
                _get_roulette_data()
                Swal.fire({
                  icon: status ? 'success' : 'info',
                  backdrop: true,
                  allowOutsideClick: false,
                  titleText: title,
                  text: message,
                  position: 'bottom',
                  showClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeInUp ms-300'
                  },
                  hideClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeOutDown ms-300'
                  }
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  backdrop: true,
                  allowOutsideClick: false,
                  titleText: 'Connection Error',
                  text: `${req.status} ${req.statusText}`,
                  position: 'bottom',
                  showClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeInUp ms-300'
                  },
                  hideClass: {
                    backdrop: '!p-0 bg-black/80',
                    popup: 'animate__animated animate__fadeOutDown ms-300'
                  }
                })
              }
            }
          })
        }
      })
    }
  }
  const send_message = (): void => {
    setMessage({ ...message, isSending: true })
    if (!message.isSending) {
      socket.emit('send-message', {
        rouletteID: WheelData.data.id,
        userid: (Config.tgUser())?.id || process.env.NEXT_PUBLIC_HARD,
        message: message.message
      }, (res: { status: boolean, title: string, message?: string }) => {
        res.status ? setMessage({ ...message, isSending: false, message: '' }) : setMessage({ ...message, isSending: false })
      })
    }
  }
  const _get_roulette_data = (): void => {
    socket.emit('roulette-data', { id: WheelData.data.id }, (res: RouletteDataTypes) => setWheelData(res))
  }
  const _stop_spin = (): void => {
    Swal.fire({
      icon: 'info',
      text: `User ${WheelData.participants[rouletteSettings.selected].userid} has lost the raffle.`,
      backdrop: true,
      allowOutsideClick: false,
      timer: 4000,
      timerProgressBar: true
    })
    SetRouletteSettings({ ...rouletteSettings, start: false })
    _get_roulette_data()
  }
  const close_dialog = (): void => {
    setDialog({ ...dialog, open: false })
    setshowConfetti(false)
  }
  const roulette_winner = (userid: string): void => {
    Swal.close()
    setTimeout(() => {
      setshowConfetti(true)
      setDialog({
        ...dialog,
        title: `User ${userid} won the raffle.`,
        open: true,
        message: `Prize ${WheelData.data.prize}`
      })
    }, 500)
  }
  useEffect(() => {
    //ping send userid to server 
    socket.emit('ping', { id: (Config.tgUser())?.id || process.env.NEXT_PUBLIC_HARD })
    //join roulette room 
    socket.emit('join-roulette-room', { id: WheelData.data.id, userid: (Config.tgUser())?.id || process.env.NEXT_PUBLIC_HARD })
    //new roulette participant 
    socket.on('new-roulette-participant', (new_data: RouletteDataTypes) => setWheelData(new_data))
    //new roulette data
    socket.on('roulette-data', (new_data: RouletteDataTypes) => setWheelData(new_data))
    //start roulette 
    socket.on('start-roulette', (res: { selected: number }) => SetRouletteSettings({ ...rouletteSettings, start: true, selected: res.selected }))
    //roulette winner 
    socket.on('roulette-winner', (res: { rouletteID: string, userid: string }) => roulette_winner(res.userid))
    //clean up
    return () => {
      socket.off('ping')
      socket.off('join-roulette-room')
      socket.off('new-roulette-participant')
      socket.off('start-roulette')
      socket.off('roulette-winner')
    }
  }, [])
  return (
    <>
      <Head>
        <title>{WheelData.data.name}</title>
      </Head>
      {account ? (
        <>
          <nav className='translucent sticky z-50 top-0 bg-zinc-900 flex items-center justify-between py-2 px-4 lg:px-10'>
            <div className='flex gap-4 items-center py-2'>
              <Link href={'/'} passHref>
                <a>
                  <FaArrowLeft
                    size={'1.25rem'}
                    className="cursor-pointer" />
                </a>
              </Link>
              <span className='text-xl'>{WheelData.data.name}</span>
            </div>
            <div className='flex gap-3'>
              <FaComments
                onClick={chat_open}
                className="cursor-pointer text-3xl dark:text-teamdao-primary/80 transition-all dark:hover:text-teamdao-primary" />
            </div>
          </nav>
          <div className='relative z-10 flex flex-col w-full overflow-hidden'>
            <div className='flex flex-col items-center gap-3 p-1 md:p-5 w-full mt-10 md:mt-5'>
              <Wheel
                mustStartSpinning={rouletteSettings.start}
                prizeNumber={rouletteSettings.selected}
                data={WheelData.participants}
                outerBorderWidth={10}
                innerBorderColor={'green'}
                fontSize={15}
                textColors={['#fff']}
                textDistance={30}
                spinDuration={0.9}
                onStopSpinning={_stop_spin}
              />
              <div className='flex flex-col gap-3 mt-3'>
                {/* Check if the user is already joined the roulette */}
                {!WheelData.data.participants.find(x => x.userid === account.info.id) && !WheelData.data.isDone && (
                  <button
                    onClick={join_roulette}
                    className='dark:bg-teamdao-primary/80 dark:hover:bg-teamdao-primary px-5 py-3 shadow-lg rounded-lg dark:text-black font-bold'>Join Roulette</button>
                )}
                {/* Check if roulette is already done */}
                {WheelData.data.isDone && (
                  <div>Done</div>
                )}
              </div>
            </div>
          </div >
          {/* Message */}
          <div id='main-wrapper-msg' className='fixed top-0 h-screen w-screen bg-black/80 z-50 hidden justify-end transition-all'>
            <div
              id='main-msg'
              animate-in="animate__animated animate__fadeInRight"
              animate-out="animate__animated animate__fadeOutRight"
              className='ms-300 w-full md:w-96 bg-zinc-900 h-full'>
              <div className='relative h-full w-full '>
                <div className="flex gap-3 py-3 px-4 items-center dark:bg-zinc-800">
                  <FaArrowLeft
                    onClick={chat_close}
                    size={'1.25rem'}
                    className="cursor-pointer" />
                  <span className='text-lg font-normal'>Roulette Chats</span>
                </div>
                <div id='chats' className='flex p-2 w-full flex-col gap-2 overflow-auto h-[calc(100vh-138px)]'>

                </div>
                <div className="absolute bottom-0 w-full p-2 flex flex-[15%] translucent">
                  <div className='relative w-full flex justify-center items-center'>
                    <textarea
                      value={message.message}
                      onInput={(e) => setMessage({ ...message, message: e.currentTarget.value })}
                      placeholder='Message'
                      className='resize-none text-sm min-h-[70px] dark:text-zinc-300 w-full dark:bg-zinc-800 outline-none border-none rounded-lg pr-10 dark:focus:ring-1 dark:focus:ring-teamdao-secondary transition-all' />
                    <div className='absolute right-3 top-3'>
                      {message.isSending ? (
                        <RiLoader5Fill className='w-6 h-6 dark:text-teamdao-primary animate-spin' />
                      ) : (
                        <FaPaperPlane
                          onClick={send_message}
                          className='w-6 h-6 dark:hover:text-teamdao-primary cursor-pointer' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 py-3 px-4 items-center dark:bg-zinc-800">
                <FaArrowLeft
                  onClick={chat_close}
                  size={'1.25rem'}
                  className="cursor-pointer" />
                <span className='text-lg font-normal'>Roulette Chats</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/* Confetti */}
      {showConfetti && <Confetti />}
      {/* Dialog */}
      <_Dialog
        open={dialog.open}
        onClose={close_dialog}
        title={dialog.title}
        message={dialog.message}
        backdrop={false}
        showCancelButton={true}
        icon={dialog.icon} />
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ROULETTE_DATA = await Roulette.findOne({ id: ctx.query['id'] })
  if (ROULETTE_DATA) {
    let participants: any[] = []
    ROULETTE_DATA.participants.map((x) => {
      if (!x.removed) participants.push(x)
    })
    return {
      props: {
        participants: JSON.stringify(participants),
        data: JSON.stringify(ROULETTE_DATA)
      }
    }
  } else {
    return {
      props: {},
      redirect: {
        destination: '/404'
      }
    }
  }
}
