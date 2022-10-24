import { Html, Head, Main, NextScript } from "next/document"
export default function Document() {
    return (
        <Html className="dark">
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#202020" />
                <meta name="title" content="TEAMDAO Raffles" />
                <link rel="shortcut icon" href="/logo.png" type="image/x-png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <script src="https://telegram.org/js/telegram-web-app.js" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <body className="scroll-smooth transition-all dark:bg-zinc-900 text-white h-screen">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}