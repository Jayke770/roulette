import { Color } from '../lib'
import { Roulette, User } from '../models'
import App from './settings'
import tg from '../Bot'
const bot = tg.bot
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
        option: string,
        created: string,
        removed: boolean,
        style: {
            backgroundColor: string
        }
    }[],
    created: string
}
type participants = {
    id: string,
    userid: string,
    option: string,
    created: string,
    removed: boolean,
    style: {
        backgroundColor: string
    }
}[]
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
        let participants: any[] = []
        ROULETTE_DATA.participants.map((x) => {
            if (!x.removed) participants.push(x)
        })
        //send to roulette room
        App.ClientWs.to(id).emit('new-roulette-participant', { data: ROULETTE_DATA, participants: participants })
    })
    //start roulette 
    socket.on('start-roulette', async ({ id }, cb) => {
        try {
            const ROULETTE_DATA: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
            let remaining_unselected: participants = []
            ROULETTE_DATA.participants.map((x) => {
                if (!x.removed) remaining_unselected.push(x)
            })
            //bake the winner 
            const REMOVE_INDEX = Math.floor(Math.random() * remaining_unselected.length)
            cb({ status: true, title: 'Roulette Started', selected: REMOVE_INDEX })
            //send to all users 
            App.ClientWs.to(id).emit('start-roulette', { selected: REMOVE_INDEX })
            setTimeout(async () => {
                //remove the index
                await Roulette.updateOne({
                    id: { $eq: id },
                    participants: { $elemMatch: { id: { $eq: remaining_unselected[REMOVE_INDEX].id } } }
                }, { $set: { "participants.$.removed": true } })
                //send message to user 
                await bot.api.sendMessage(remaining_unselected[REMOVE_INDEX].userid, `You have lost in raffle ${ROULETTE_DATA.name}. Try again next time.`)
            }, 9000)
        } catch (e) {
            console.log(e)
            cb({ status: false, title: 'Server Error' })
        }
    })
    //check the winner 
    socket.on('who-is-the-winner', async ({ id }, cb) => {
        try {
            //get roulette data
            let ROULETTE_DATA: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
            const REMAINING_UNSELECTED = ROULETTE_DATA.participants.reduce((sum, x) => sum + (x.removed ? 0 : 1), 0)
            if (REMAINING_UNSELECTED === 1) {
                const WINNER = ROULETTE_DATA.participants.find(x => !x.removed)
                //update roulette data 
                await Roulette.updateOne({ id: { $eq: id } }, {
                    $set: {
                        isDone: true,
                        startRoulette: false,
                        winner: ROULETTE_DATA.participants.indexOf(WINNER)
                    }
                })
                ROULETTE_DATA = await Roulette.findOne({ id: { $eq: id } })
                cb({ status: true })
                //send to all users 
                App.ClientWs.to(id).emit('roulette-data', { data: ROULETTE_DATA, participants: [WINNER] })
                //emit events to control and client that we have a winner
                App.ClientWs.to(id).emit('roulette-winner', { rouletteID: ROULETTE_DATA.id, userid: WINNER.userid })
                App.ControlWs.to(id).emit('roulette-winner', { rouletteID: ROULETTE_DATA.id, userid: WINNER.userid })
                setTimeout(async () => {
                    //send message to winner
                    await bot.api.sendMessage(WINNER.userid, `You won ${ROULETTE_DATA.prize} in the ${ROULETTE_DATA.name}.`, {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: 'Check Raffle', web_app: { url: `${process.env.HOST}/roulette/${ROULETTE_DATA.id}` } }
                            ]]
                        }
                    })
                }, 9000)
            } else {
                cb({ status: false })
            }
        } catch (e) {
            console.log(e)
            cb({ status: false })
        }
    })
    //get roulette data 
    socket.on('roulette-data', async ({ id }, cb) => {
        const ROULETTE_DATA: RouletteTypes = await Roulette.findOne({ id: { $eq: id } })
        let participants: any[] = []
        ROULETTE_DATA.participants.map((x) => {
            if (!x.removed) participants.push(x)
        })
        cb({ data: ROULETTE_DATA, participants: participants })
    })
    //new roulette 
    socket.on('new-roulette', async () => {
        const ROULETTE_DATA: RouletteTypes[] = await Roulette.find({}).sort({ _id: -1 })
        //send to admin 
        App.ControlWs.emit('roulettes', ROULETTE_DATA)
        //send to all users 
        App.ClientWs.emit('roulettes', ROULETTE_DATA)
    })
})