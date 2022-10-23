import App from './settings'
import './ControlWs'
import './ClientWs'
App.httpServer.listen(App.port, () => {
  console.log(`> Ready on ${App.port}`)
})