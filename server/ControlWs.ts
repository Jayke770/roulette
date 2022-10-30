import { Color } from '../lib'
import { Roulette, User } from '../models'
import App from './settings'
type RouletteTypes = {
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    startRoulette: boolean,
    StartDate: string,
    maxParticipants: number,
    isDone: boolean,
    winner: number,
    participants: {
        id: string,
        userid: string,
        created: string
    }[],
    created: string
}
App.ControlWs.on('connection', async (socket) => {
    //get user info 
    socket.on('user-info', async ({ id }, cb) => {
        try {
            const userData = await User.findOne({ 'info.id': { $eq: id } }, { info: 1, socketID: 1 })
            cb(userData)
        } catch (e) {
            cb(null)
        }
    })
    //join in roulette room 
    socket.on('join-roulette-room', ({ id }) => {
        console.log('rou', id)
        socket.join(id)
        socket.to(socket.id).emit('roulette-data', { d: 1 })
    })
    //new roulette participant 
    socket.on("new-roulette-participant", async ({ id }) => {
        //notify all users in roulette room 
        const ROULETTE_DATA: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
        let new_participants_data: any[] = []
        ROULETTE_DATA.participants.map((x) => {
            new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
        })
        //send to roulette room
        App.ClientWs.to(id).emit('new-roulette-participant', { data: ROULETTE_DATA, roulette: new_participants_data })
    })
    //start roulette 
    socket.on('start-roulette', async ({ id }, cb) => {
        try {
            let roulette_data: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
            //bake the winner 
            const WINNER = Math.floor(Math.random() * roulette_data.participants.length)
            //update roulette winner & startRoulette key 
            await Roulette.updateOne({ id: { $eq: id } }, { $set: { winner: WINNER, startRoulette: true } })
            //get the latest roulette data 
            roulette_data = await Roulette.findOne({ id: { $eq: id } })
            let new_participants_data: any[] = []
            roulette_data.participants.map((x) => {
                new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
            })
            //emit to roulette room 
            App.ClientWs.to(id).emit('roulette-data', { data: roulette_data, roulette: new_participants_data })
            //emit to admin
            await Roulette.updateOne({ id: { $eq: id } }, { $set: { isDone: true } })
            //send to admin 
            roulette_data = await Roulette.findOne({ id: { $eq: id } })
            socket.emit('roulette-data', { data: roulette_data, roulette: new_participants_data })
            cb({ status: true, title: 'Roulette Started', message: '' })
        } catch (e) {
            console.log(e)
            cb({ status: false, title: 'Server Error', message: e.message })
        }
    })
    //get roulette data 
    socket.on('roulette-data', async ({ id }, cb) => {
        try {
            let roulette_data: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
            let new_participants_data: any[] = []
            roulette_data.participants.map((x) => {
                new_participants_data.push({ option: x.userid, id: x.id, style: { backgroundColor: Color.dark(), textColor: Color.light() } })
            })
            cb({ data: roulette_data, roulette: roulette_data })
        } catch (e) {
            cb({ status: false, title: "Connection Error", message: e.message })
        }
    })
})