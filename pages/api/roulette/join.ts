import moment from "moment"
import { NextApiResponse, NextApiRequest } from "next"
import { Config, Color } from "../../../lib"
import { Roulette, User } from "../../../models"
interface x extends NextApiRequest {
    body: {
        userid: string,
        rouletteID: string
    },
    method: 'POST'
}
export default async function JoinRoulette(req: x, res: NextApiResponse) {
    const { method, body: { userid, rouletteID } } = req
    try {
        if (method === 'POST' && userid && rouletteID) {
            const USERDATA = await User.findOne({ 'info.id': { $eq: userid } }, { info: 1 })
            if (USERDATA) {
                //check if the user is not a participant 
                const ROULETTE_DATA = await Roulette.findOne({ id: rouletteID })
                const isParticipant = ROULETTE_DATA.participants.find(x => x.userid === userid)
                //if roulette data is found
                if (ROULETTE_DATA) {
                    //if roulette is already ended
                    if (ROULETTE_DATA.isDone) {
                        return res.send({
                            status: false,
                            title: 'Oppss',
                            message: "Roulette is already ended"
                        })
                    } else {
                        //if user is already a participant
                        if (isParticipant) {
                            return res.send({
                                status: false,
                                title: 'Oppss',
                                message: "You're already a participant."
                            })
                        } else {
                            //insert new participant 
                            const NEW_PARTICIPANT = {
                                id: Config.id(12),
                                userid: userid,
                                option: userid,
                                style: {
                                    backgroundColor: Color.dark()
                                },
                                created: moment().format()
                            }
                            await Roulette.updateOne({ id: { $eq: rouletteID } }, { $push: { participants: NEW_PARTICIPANT } })
                            return res.send({
                                status: true,
                                title: 'Successfully Joined',
                                message: ''
                            })
                        }
                    }
                } else {
                    return res.send({
                        status: false,
                        title: 'Roulette Not Found',
                        message: 'Please try again'
                    })
                }
            } else {
                return res.status(404).send('...')
            }
        } else {
            return res.status(401).send('...')
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send('...')
    }
}