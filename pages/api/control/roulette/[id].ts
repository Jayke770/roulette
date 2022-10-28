import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../../lib/Db/connect'
import { Roulette } from '../../../../models'
interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}
export default async function Roulettes(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req
    const USERLOGGED = await getSession({ req })
    try {
        if (method === 'GET' && USERLOGGED) {
            await dbConnect()
            const ROULETTES = id === 'all' ? await Roulette.find().sort({ _id: -1 }) : await Roulette.findOne({ id: id })
            return res.send(ROULETTES)
        } else {
            return res.status(401).send("...")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error Bitch")
    }
}