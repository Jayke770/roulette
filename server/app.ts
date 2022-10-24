import App from './settings'
import bot from '../Bot'
import './ControlWs'
import './ClientWs'
App.httpServer.listen(App.port, async () => {
  await bot.start()
  await bot.api.setMyCommands([
    { command: 'start', description: 'Start Bot' }
  ])
  console.log(`> Ready on ${App.port}`)
})