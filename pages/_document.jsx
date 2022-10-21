import { Html, Head, Main, NextScript } from "next/document"
export default function Document() {
    return (
        <Html className="dark">
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#202020" />
                <script src="https://telegram.org/js/telegram-web-app.js" />
            </Head>
            <body className="scroll-smooth transition-all dark:bg-zinc-900 overflow-hidden">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}