import { createContext } from 'react'
import { io } from "socket.io-client"
const socket = io()
const socketContext = createContext(socket)
export default socketContext