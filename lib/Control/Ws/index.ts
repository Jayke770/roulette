import { createContext } from 'react'
import { io } from "socket.io-client"
const socket = io('/control')
const socketContext = createContext(socket)
export default socketContext