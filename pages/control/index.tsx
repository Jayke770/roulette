import Head from 'next/head'
import Link from 'next/link'
import CountUp from 'react-countup'
import { getSession } from 'next-auth/react'
import {GetServerSideProps} from 'next'
import { ControlMain, ControlNavbar } from '../../components'
const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const card = Array.from({ length: 10 })
export default function Control() {
    return (
        <div className='h-screen overflow-auto'>
            <Head>
                <title>TEAMDAO</title>
            </Head>
            <div className="min-h-full">
                <ControlNavbar page={'Dashboard'} />
                <ControlMain>
                    <div className='transition-all flex flex-col lg:grid lg:grid-cols-3 gap-4 px-2 lg:px-0'>
                        <div className='col-span-2 p-5'>
                            <div className='text-2xl font-medium px-3'>Top Roulettes</div>
                            <div className='grid gap-2 lg:grid-cols-2 mt-4 p-2 h-[410px] overflow-auto'>
                                {card.map((_, i) => (
                                    <Link key={i} href={'#'} passHref>
                                        <div key={i} className='flex flex-col cursor-pointer transition-all dark:bg-green-secondary/25 dark:hover:bg-green-secondary/50 px-4 py-3 rounded-lg shadow-sm'>
                                            <div className='dark:text-zinc-300'>MLBB Raffle</div>
                                            <div className='flex items-baseline justify-between'>
                                                <span className='text-sm font-thin'>Participants</span>
                                                <CountUp
                                                    start={0}
                                                    className=" font-light"
                                                    end={1000} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className='p-5'>
                            <div className='text-2xl font-medium px-3'>Active Users</div>
                            <div className='flex flex-col gap-2 py-3 px-2 h-[425px] overflow-auto mt-4'>
                                {card.map((_, i) => (
                                    <Link key={i} href={'#'} passHref>
                                        <a className='flex gap-2 items-center cursor-pointer transition-all dark:bg-green-secondary/25 dark:hover:bg-green-secondary/50  px-4 py-3 rounded-lg shadow-sm'>
                                            <img
                                                src={user.imageUrl}
                                                alt="user"
                                                className="w-12 h-12 rounded-full" />
                                            <div className='flex flex-col'>
                                                <span className='text-sm'>Jake Gwapo</span>
                                                <span className='font-thin text-xs'>313113131</span>
                                            </div>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </ControlMain>
            </div>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USERLOGGED = await getSession(ctx)
    if (USERLOGGED) {
        return {
            props: {}
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