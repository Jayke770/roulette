import App from './settings'
import tg from '../Bot'
import './ControlWs'
import './ClientWs'
App.httpServer.listen(App.port, async () => {
  tg.run(tg.bot)
  await tg.bot.api.setMyCommands([
    { command: 'start', description: 'Start Bot' }
  ])
  console.log(`> Ready on ${App.port}`)
  console.log(`> Host ${process.env.HOST}`)
})