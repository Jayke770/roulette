import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { User } from '../../../../models'
interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}
export default async function Users(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req
    const USERLOGGED = await getSession({ req })
    try {
        if (method === 'GET' && USERLOGGED) {
            const USERS = id === 'all' ? await User.find().sort({ _id: -1 }) : await User.findOne({ 'info.id': { $eq: id } })
            return res.send(USERS)
        } else {
            return res.status(401).send("...")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error Bitch")
    }
}