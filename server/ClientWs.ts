import App from './settings'
import dbConnect from '../lib/Db/connect'
import { Roulette } from '../models'
App.ClientWs.on('connection', async (socket) => {
    //get roulettes 
    socket.on('roulettes', async (cb) => {
        await dbConnect()
        const data = await Roulette.find()
        cb(data)
    })
})