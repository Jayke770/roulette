import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Websocket, Color, ClientRouletteData, Config } from '../../lib'
import Head from 'next/head'
import { Background } from '../../components'
import { GetServerSideProps } from 'next'
import { Roulette } from '../../models'
import { useRouter } from 'next/router'
const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false, loading: () => <span>Loading</span> }
)
const hard = "1391502332"
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
  // useEffect(() => {
  //     if (!Config.tgUser()) {
  //         router.push("404")
  //     }
  // })
  useEffect(() => {
    //ping send userid to server 
    socket.emit('ping', { id: hard })
    //join roulette room 
    socket.emit('join-roulette-room', { id: WheelData.data.id, userid: hard })
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
  console.log(WheelData)
  return (
    <>
      <Head>4
        <title>TEAMDAO</title>
      </Head>
      <Background />
      <div className='relative z-50 flex flex-col justify-center items-center h-screen w-full overflow-hidden'>
        <div className='flex flex-col justify-center items-center gap-3 p-5'>
          <Wheel
            mustStartSpinning={WheelData.data.startRoulette}
            prizeNumber={WheelData.data.winner}
            data={WheelData.roulette}
            outerBorderWidth={10}
            innerBorderColor={'green'}
            fontSize={15}
            textDistance={30}
            spinDuration={2}
            onStopSpinning={() => alert(WheelData.data.participants[WheelData.data.winner].userid)}
          />
        </div>
      </div >
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