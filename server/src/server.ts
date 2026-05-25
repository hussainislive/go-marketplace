import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import prisma from './config/database'
import logger from './utils/logger'

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const httpServer = http.createServer(app)

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
})

io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`)

  socket.on('user:join', (userId: string) => {
    socket.join(`user:${userId}`)
    logger.debug(`Socket ${socket.id} joined room user:${userId}`)
  })

  socket.on('conversation:join', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`)
  })

  socket.on('conversation:leave', (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`)
  })

  socket.on('user:typing', (data: { conversationId: string; userId: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('user:typing', data)
  })

  socket.on('disconnect', () => {
    logger.debug(`Socket disconnected: ${socket.id}`)
  })
})

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
