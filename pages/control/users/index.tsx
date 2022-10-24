import Head from "next/head"
import { ControlMain, ControlNavbar } from "../../../components"
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
const card = Array.from({ length: 50 })
export default function Users() {
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <ControlNavbar page={'Users'} />
            <ControlMain>
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