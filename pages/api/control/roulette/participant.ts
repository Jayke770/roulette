import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from '../../../../lib/Db/connect'
import { Roulette } from '../../../../models'
import moment from 'moment'
interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        id: string,
        participant: {
            id: string,
            userid: string,
            username: string,
            created: string
        }
    }
}
export default async function RouletteSegment(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, headers, body: { id, participant } } = req
    try {
        if (method === 'POST' && headers['api-key'] === process.env.SECRET) {
            await dbConnect()
            //check if roulette exists
            const data: any = await Roulette.findOne({ id: { $eq: id } }, { id: 1 })
            if (data) {
                //update roulette 
                await Roulette.updateOne({ id: { $eq: id } }, { $push: { participants: participant } })
                return res.send({
                    status: true,
                    title: 'Roulette Participants Successfully Updated',
                    message: moment().format()
                })
            } else {
                return res.status(404).send("Not Found")
            }
        } else {
            return res.status(401).send("....")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error")
    }
}