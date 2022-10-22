import '../styles/globals.css'
import 'animate.css'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import NextNProgress from 'nextjs-progressbar'
import React from 'react'
interface CustomWindow extends Window {
    Telegram?: any
}
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        const MyWindow: CustomWindow = window
        MyWindow.Telegram.WebApp.ready()
        MyWindow.Telegram.WebApp.expand()
    })
    return (
        <>
            <NextNProgress
                color="#2afe30"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
            />
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}