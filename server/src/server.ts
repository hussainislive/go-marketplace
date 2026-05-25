import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import prisma from './config/database'
import logger from './utils/logger'
import { registerSocketHandlers } from './sockets'

const PORT = process.env.PORT || 5001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const httpServer = http.createServer(app)

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
  // Allow both polling and websocket transports
  transports: ['websocket', 'polling'],
})

registerSocketHandlers(io)

async function start() {
  try {
    await prisma.$connect()
    logger.info('Database connected')

    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
    })
  } catch (err) {
    logger.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
