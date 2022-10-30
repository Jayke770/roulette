import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Websocket, Color, Config, AccountData } from '../../lib'
import Head from 'next/head'
import { Background, ClientRouletteChatRecieved, ClientRouletteChatSent } from '../../components'
import { GetServerSideProps } from 'next'
import { Roulette } from '../../models'
import { useRouter } from 'next/router'
import { FaComments, FaArrowLeft, FaPaperPlane } from 'react-icons/fa'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { faker } from '@faker-js/faker'
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
type RouletteData = {
  data: any,
  roulette: any
}
export default function RouletteData(props: RouletteData) {
  const router = useRouter()
  const socket = useContext(Websocket)
  const [WheelData, setWheelData] = useState<RouletteDataTypes>({
    data: JSON.parse(props.data),
    roulette: JSON.parse(props.roulette)
  })
  const { account } = AccountData(process.env.NODE_ENV !== 'development' ? (Config.tgUser())?.id : process.env.NEXT_PUBLIC_HARD)
  useEffect(() => {
    if (!Config.tgUser() && process.env.NODE_ENV !== 'development') {
      router.push("404")
    }
  })
  useEffect(() => {
    //ping send userid to server 
    socket.emit('ping', { id: process.env.NODE_ENV !== 'development' ? (Config.tgUser())?.id : process.env.NEXT_PUBLIC_HARD })
    //join roulette room 
    socket.emit('join-roulette-room', { id: WheelData.data.id, userid: process.env.NODE_ENV !== 'development' ? (Config.tgUser())?.id : process.env.NEXT_PUBLIC_HARD })
    //new roulette participant 
    socket.on('new-roulette-participant', (new_data: RouletteDataTypes) => {
      setWheelData({ ...WheelData, data: new_data.data, roulette: new_data.roulette })
    })
    //new roulette data
    socket.on('roulette-data', (new_data: RouletteDataTypes) => {
      setWheelData({ ...WheelData, data: new_data.data, roulette: new_data.roulette })
    })
    //clean up
    return () => {
      socket.off('ping')
      socket.off('join-roulette-room')
      socket.off('new-roulette-participant')
    }
  }, [])
  const chat_open = () => {
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
  const chat_close = () => {
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
  const join_roulette = () => {
    if (!WheelData.data.participants.find(x => x.userid === account.info.id)) {
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
                socket.emit('roulette-data', { id: WheelData.data.id }, (new_data: RouletteDataTypes) => {
                  setWheelData({ ...WheelData, data: new_data.data, roulette: new_data.roulette })
                })
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
  return (
    <>
      <Head>
        <title>{WheelData.data.name}</title>
      </Head>
      <Background />
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
                mustStartSpinning={WheelData.data.startRoulette}
                prizeNumber={WheelData.data.winner}
                data={WheelData.roulette}
                outerBorderWidth={10}
                innerBorderColor={'green'}
                fontSize={15}
                textDistance={30}
                spinDuration={0.9}
              />
              <div className='flex flex-col gap-3 mt-3'>
                {/* Check if the user is already joined the roulette */}
                {!WheelData.data.participants.find(x => x.userid === account.info.id) ? (
                  <button
                    onClick={join_roulette}
                    className='dark:bg-teamdao-primary/80 dark:hover:bg-teamdao-primary px-5 py-3 shadow-lg rounded-lg dark:text-black font-bold'>Join Roulette</button>
                ) : null}
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
                  {Array.from({ length: 5 }).map((x, i) => (
                    <ClientRouletteChatSent
                      key={i}
                      username={faker.name.firstName()}
                      message={faker.hacker.phrase()} />
                  ))}
                  {Array.from({ length: 5 }).map((x, i) => (
                    <ClientRouletteChatRecieved
                      key={i}
                      username={faker.name.firstName()}
                      message={faker.hacker.phrase()} />
                  ))}
                  {Array.from({ length: 5 }).map((x, i) => (
                    <ClientRouletteChatSent
                      key={i}
                      username={faker.name.firstName()}
                      message={faker.hacker.phrase()} />
                  ))}
                </div>
                <div className="absolute bottom-0 w-full p-2 flex flex-[15%] translucent">
                  <div className='relative w-full flex justify-center items-center'>
                    <textarea
                      placeholder='Message'
                      className='resize-none text-sm min-h-[70px] dark:text-zinc-300 w-full dark:bg-zinc-800 outline-none border-none rounded-lg pr-10 dark:focus:ring-1 dark:focus:ring-teamdao-secondary transition-all' />
                    <FaPaperPlane
                      className='absolute right-3 top-3 w-6 h-6' />
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
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
        destination: '/404'
      }
    }
  }
}