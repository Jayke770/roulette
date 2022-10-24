import { createContext } from 'react'
import { io } from "socket.io-client"
const socket = io('/client', {
    forceBase64: true
})
const socketContext = createContext(socket)
export default socketContext