import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from 'next-auth/react'
import { Roulette } from '../../../../models'
import { Config } from '../../../../lib'
import moment from 'moment'
interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        autoStart: boolean,
        raffleName: string,
        rafflePrize: string,
        raffleDate: string
    }
}
export default async function CreateRoulette(req: ExtendedNextApiRequest, res: NextApiResponse) {
    const { method, body: { autoStart, raffleDate, raffleName, rafflePrize } } = req
    const USERLOGGED = await getSession({ req })
    try {
        if (method === 'POST' && USERLOGGED) {
            //save new roulette 
            const new_roulette = new Roulette({
                id: Config.id(12),
                autoStart: autoStart,
                name: raffleName,
                prize: rafflePrize,
                startRoulette: false,
                winner: null,
                StartDate: autoStart ? moment(raffleDate).format() : '',
                maxParticipants: parseInt(process.env.MAX_RAFFLE_PARTICIPANTS),
                participants: [],
                isDone: false,
                created: moment().format()
            })
            await new_roulette.save().then((data: any) => {
                return res.send({
                    status: data ? true : false,
                    title: data ? 'Roulette Successfully Created' : "Opppss",
                    message: data ? raffleName : 'Failed To Created Roulette'
                })
            }).catch((e: any) => {
                throw new Error(e)
            })
        } else {
            return res.status(401).send("....")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Error Bitch")
    }
}