import Head from "next/head"
import { ControlMain, ControlNavbar, ControlUserCard, ManLoader } from "../../../components"
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import ControlWs from '../../../lib/Control/Ws'
import { useContext } from "react"
import { ControlUsers } from "../../../lib"
const card = Array.from({ length: 50 })
export default function Users() {
    const socket = useContext(ControlWs)
    const { Users } = ControlUsers()
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <ControlNavbar page={'Users'} />
            <ControlMain>
                <div className="flex flex-col gap-3 p-2 md:p-0 !pb-40">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <input
                                type={'search'}
                                placeholder="Search User"
                                className="bg-zinc-800 rounded-lg border-none transition-all outline-none dark:focus:ring-teamdao-primary font-normal" />
                        </div>
                    </div>
                    <div className="transition-all grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {Users ? (
                            Users.map((user, i) => (
                                <ControlUserCard
                                    key={i}
                                    userid={user.info.id}
                                    image={`/api/profile/${user.info.id}`}
                                    socket={socket} />
                            ))
                        ) : <ManLoader />}
                    </div>
                </div>
            </ControlMain>
        </>
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