import { Bot } from 'grammy'
import moment from 'moment'
import { Config } from '../lib'
import dbConnect from '../lib/Db/connect'
import { User } from '../models'
const bot = new Bot(process.env.BOT_TOKEN)
bot.command("start", async (ctx) => {
    try {
        await dbConnect()
        const USERDATA = await User.findOne({ 'info.id': { $eq: Config.str(ctx.from.id) } })
        //profile pohoto path
        const USERPROFILE = (await bot.api.getFile((await bot.api.getUserProfilePhotos(ctx.from.id)).photos[0][0].file_id)).file_path
        //check if user already registered 
        if (USERDATA) {
            //update user info 
            await User.updateOne({ 'info.id': { $eq: Config.str(ctx.from.id) } }, {
                $set: {
                    info: {
                        id: Config.str(ctx.from.id),
                        first_name: ctx.from.first_name,
                        last_name: ctx.from.last_name,
                        username: ctx.from.username,
                        image: USERPROFILE
                    }
                }
            })
        } else {
            //create new user
            const NEW_USER = new User({
                info: {
                    id: Config.str(ctx.from.id),
                    first_name: ctx.from.first_name,
                    last_name: ctx.from.last_name,
                    username: ctx.from.username,
                    image: USERPROFILE
                },
                balance: 10000,
                socketID: '',
                notification: [],
                created: moment().format()
            })
            //save new user 
            await NEW_USER.save()
        }
        //send message
        await ctx.reply(`Hi @${ctx.from.username}, Welcome to TEAMDAO Tournament Raffle Bot`, {
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Check Raffles', web_app: { url: process.env.HOST } }
                ]]
            }
        })
    } catch (e) {
        console.log(e)
    }
})
export default bot