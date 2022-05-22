import { Server } from 'socket.io'
import http from 'http'

let io: Server | null = null

const initServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('new connection', socket.id)
  })
}

export const getIo = () => io

export default initServer
