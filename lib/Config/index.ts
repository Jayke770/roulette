import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12)
const config = {
    APPNAME: 'TEAMDAO Spinning Wheel',
    id: (size: number) => {
        return nanoid(size)
    },
}
export default config