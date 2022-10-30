import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12)
interface CustomWindow extends Window {
    Telegram?: any
}
const config = {
    APPNAME: 'TEAMDAO Spinning Wheel',
    id: (size?: number) => {
        return nanoid(size ? size : 10)
    },
    str: (str: any) => str.toString(),
    tgUser: () => {
        type tgUSER = {
            id: string,
            first_name: string,
            lastname: string,
            username: string,
            language_code: string
        }
        const MyWindow: CustomWindow = typeof window !== 'undefined' ? window : undefined
        const data = typeof window !== 'undefined' ? new URLSearchParams(MyWindow.Telegram.WebApp.initData) : undefined
        const x: tgUSER = data ? JSON.parse(data.get("user")) : data
        return x
    },
}
export default config