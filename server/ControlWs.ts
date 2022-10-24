import { Color } from '../lib'
import dbConnect from '../lib/Db/connect'
import { Roulette } from '../models'
import App from './settings'
App.ControlWs.on('connection', async (socket) => {
    //join in roulette room 
    socket.on('join-roulette-room', ({ id }) => {
        socket.join(id)
    })
    //new roulette participant 
    socket.on("new-roulette-participant", async ({ id }) => {
        //notify all users in roulette room 
        await dbConnect()
        const ROULETTE_DATA = await Roulette.findOne({ id: { $eq: id } })
        let new_participants_data: any[] = []
        ROULETTE_DATA.participants.map((x) => {
            new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
        })
        //send to roulette room
        App.ClientWs.to(id).emit('new-roulette-participant', { data: ROULETTE_DATA, roulette: new_participants_data })
    })
})