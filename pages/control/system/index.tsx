import Head from "next/head"
import { ControlNavbar } from "../../../components"
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
export default function System() {
    return (
        <>
            <Head>
                <title>System</title>
            </Head>
            <ControlNavbar page={'System'} />
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