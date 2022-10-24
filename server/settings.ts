import express from 'express'
import next from 'next'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { instrument } from '@socket.io/admin-ui'
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const ORIGIN = dev ? [process.env.HOST, "https://admin.socket.io"] : process.env.HOST
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare()
const server = express()
//server settings 
server.use(cors({
    origin: ORIGIN
}))
const httpServer = createServer(server)
const io = new Server(httpServer, {
    cors: {
        origin: ORIGIN,
        credentials: true
    }
})
instrument(io, {
    auth: false
})
server.all('*', (req, res) => {
    return handle(req, res)
})
const ControlWs = io.of('/control')
const ClientWs = io.of('/client')
const x = { httpServer, ControlWs, ClientWs, port }
export default x