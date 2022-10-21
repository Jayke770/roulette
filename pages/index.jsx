import React, { useState, useContext, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Websocket, Color } from '../lib'
import Head from 'next/head'
import { Background } from '../components'
const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
)
export default function Home() {
  const ws = useContext(Websocket)
  const [WheelData, setWheelData] = useState({
    start: false,
    winner: undefined,
    data: [
      { option: 'fasf', style: { backgroundColor: Color.dark(), textColor: Color.light() } },
      { option: 'fasfasff', style: { backgroundColor: Color.dark(), textColor: Color.light() } },
      { option: 'fasffsaf', style: { backgroundColor: Color.dark(), textColor: Color.light() } },
      { option: 'f4124f', style: { backgroundColor: Color.dark(), textColor: Color.light() } }
    ]
  })
  useEffect(() => {
    //when new data received 
    ws.on('new-data', (data) => {
      if (data instanceof Array) {
        setWheelData({ ...WheelData, data: [...WheelData.data, ...data] })
      }
    })
    //start & stop spinning 

    return () => {
      ws.off('new-data')
    }
  }, [])
  return (
    <>
      <Head>4
        <title>TEAMDAO</title>
      </Head>
      <Background />
      <div className='relative z-50 flex flex-col justify-center items-center h-screen w-full'>
        <div className='flex flex-col justify-center items-center gap-3 p-5'>
          <Wheel
            mustStartSpinning={WheelData.start}
            prizeNumber={WheelData.winner}
            data={WheelData.data}
            outerBorderWidth={10}
            innerBorderColor={'green'}
            fontSize={12}
            textDistance={40}
            spinDuration={1}
          />
        </div>
      </div >
    </>
  )
}