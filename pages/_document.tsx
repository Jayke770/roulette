import { Html, Head, Main, NextScript } from "next/document"
export default function Document() {
    return (
        <Html className="dark">
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#202020" />
                <script src="https://telegram.org/js/telegram-web-app.js" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <body className="scroll-smooth transition-all dark:bg-zinc-900 text-white overflow-hidden h-screen">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}