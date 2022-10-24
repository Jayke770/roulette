import stream from 'stream'
import { promisify } from 'util'
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/Db/connect'
import { User } from '../../../models'
const pipeline = promisify(stream.pipeline)
interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}
type User = {
    info: {
        id: string,
        first_name?: string,
        last_name?: string,
        username: string,
        image?: string
    }
}
export default async function Profile(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req
    try {
        if (method === 'GET') {
            await dbConnect()
            await User.findOne({ 'info.id': { $eq: id } }, { info: 1 }).then(async (user_data: User) => {
                if (user_data) {
                    const img = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${user_data.info.image}`)
                    //@ts-ignore
                    await pipeline(img.body, res)
                } else {
                    const img = await fetch(`${process.env.HOST}/logo.png`)
                    //@ts-ignore
                    await pipeline(img.body, res)
                }
            }).catch((e) => {
                throw new Error(e)
            })
        } else {
            return res.status(401).send('...')
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send('...')
    }
}