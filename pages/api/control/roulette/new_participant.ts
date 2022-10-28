import { NextApiRequest, NextApiResponse } from "next"
import dbConnect from '../../../../lib/Db/connect'
import { Roulette, User } from '../../../../models'
import moment from 'moment'
import { getSession } from "next-auth/react"
import { Config } from "../../../../lib"
interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        userid: string,
        rouletteid: string
    }
}
type roulettedata = {
    _id?: any,
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    StartDate: string,
    maxParticipants: number,
    participants: {
        id: string,
        userid: string,
        created: string
    }[],
    isDone: boolean,
    created: string,
    __v?: 0
}
export default async function NewParticipant(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, body: { userid, rouletteid } } = req
    const USERLOGGED = await getSession({ req })
    try {
        if (method === 'POST' && USERLOGGED) {
            await dbConnect()
            await Roulette.findOne({ id: { $eq: rouletteid } }).then(async (roulettedata: roulettedata) => {
                if (roulettedata) {
                    if (roulettedata.isDone) {
                        return res.send({
                            status: false,
                            title: 'Opppss',
                            message: 'Roulette is already ended'
                        })
                    } else {
                        //check if the user is not a participant 
                        const isParticipant = roulettedata.participants.find(x => x.userid === userid)
                        if (isParticipant) {
                            return res.send({
                                status: false,
                                title: 'Opppss',
                                message: 'This userid is already a participant.'
                            })
                        } else {
                            //check if the participant is a available in users collection
                            const isUser = await User.findOne({ 'info.id': { $eq: userid } }, { info: 1 })
                            if (isUser) {
                                //insert new participant 
                                const NEW_PARTICIPANT = {
                                    id: Config.id(12),
                                    userid: userid,
                                    created: moment().format()
                                }
                                await Roulette.updateOne({ id: { $eq: rouletteid } }, { $push: { participants: NEW_PARTICIPANT } })
                                //send response
                                return res.send({
                                    status: true,
                                    title: 'Roulette Participants Successfully Updated',
                                    message: `Total Participants: ${roulettedata.participants.length + 1}`
                                })
                            } else {
                                return res.send({
                                    status: false,
                                    title: 'Opppss',
                                    message: `User ID Not Found`
                                })
                            }
                        }
                    }
                } else {
                    return res.send({
                        status: false,
                        title: 'Roulette Not Found',
                        message: 'Please Try Again'
                    })
                }
            }).catch((e) => {
                throw new Error(e)
            })
        } else {
            return res.status(401).send("...")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error Bitch")
    }
}   