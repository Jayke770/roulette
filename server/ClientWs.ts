import App from './settings'
import { Roulette, User } from '../models'
import { Color } from '../lib'
App.ClientWs.on('connection', async (socket) => {
    //client disconnect 
    socket.on('disconnect', async () => {
        await User.updateOne({ socketID: { $eq: socket.id } }, { $set: { socketID: '' } })
    })
    //ping update user socket id  
    socket.on('ping', async ({ id }) => {
        await User.updateOne({ 'info.id': { $eq: id } }, { $set: { socketID: socket.id } })
    })
    //join roulette room 
    socket.on("join-roulette-room", async ({ id, userid }) => {
        socket.join(id)
        //notify users in the specific room 
        socket.to(id).emit('new-user-join-room')
    })
    //get roulettes 
    socket.on('roulettes', async (cb) => {
        const data = await Roulette.find().sort({ _id: -1 })
        cb(data)
    })
    //get roulette data 
    socket.on('roulette-data', async ({ id }, cb) => {
        const ROULETTE_DATA = await Roulette.findOne({ id: { $eq: id } })
        //modify participants array 
        let new_participants_data: any[] = []
        ROULETTE_DATA.participants.map((x) => {
            new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
        })
        cb({
            roulette: new_participants_data,
            data: ROULETTE_DATA
        })
    })
})