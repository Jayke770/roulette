import '../styles/globals.css'
import { useEffect } from 'react'
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()
    })
    return (
        <Component {...pageProps} />
    )
}