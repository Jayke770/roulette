import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../models'
interface ExtendedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}
export default async function AccountData(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, query: { id } } = req
    try {
        if (method == 'GET' && id) {
            const USERDATA = await User.findOne({ 'info.id': { $eq: id } }, { info: 1, _id: 0 })
            return res.send(USERDATA)
        } else {
            return res.status(403).send('...')
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send('...')
    }
}