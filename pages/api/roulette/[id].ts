import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/DB/connect'
import { Roulette } from '../../../models'
interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        id: any
    }
}
export default async function RouletteData(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req
    try {
        if (method === 'GET' && id) {
            await dbConnect()
            const ROULETTES = id === 'all' ? await Roulette.find().sort({ _id: -1 }) : await Roulette.findOne({ id: id })
            return res.send(ROULETTES)
        } else {
            return res.status(403).send('...')
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send('...')
    }
}