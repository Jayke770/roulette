import Head from "next/head"
import { ControlMain, ControlNavbar } from "../../../components"
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