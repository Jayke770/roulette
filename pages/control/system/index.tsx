import Head from "next/head"
import { ControlNavbar } from "../../../components"

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