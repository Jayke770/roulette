import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Websocket, Color, ClientRouletteData } from '../../lib'
import Head from 'next/head'
import { Background } from '../../components'
import dbConnect from '../../lib/Db/connect'
import { GetServerSideProps } from 'next'
import { Roulette } from '../../models'
const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
)
interface RouletteDataTypes {
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
export default function RouletteData(props: RouletteData) {
  console.log(props)
  const socket = useContext(Websocket)
  const [WheelData, setWheelData] = useState<RouletteDataTypes>()
  return (
    <>
      <Head>4
        <title>TEAMDAO</title>
      </Head>
      <Background />
      <div className='relative z-50 flex flex-col justify-center items-center h-screen w-full'>
        <div className='flex flex-col justify-center items-center gap-3 p-5'>
          <Wheel
            mustStartSpinning={false}
            prizeNumber={1}
            data={[]}
            outerBorderWidth={10}
            innerBorderColor={'green'}
            fontSize={15}
            textDistance={30}
            spinDuration={1}
          />
        </div>
      </div >
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await dbConnect()
  const ROULETTE_DATA = await Roulette.findOne({ id: ctx.query['id'] })
  if (ROULETTE_DATA) {
    //modify participants array 
    let data: RouletteDataTypes = ROULETTE_DATA, new_participants_data: any[] = []
    data.participants.forEach((x) => {
      console.log({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
    })
    console.log('fsa', new_participants_data)
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
}