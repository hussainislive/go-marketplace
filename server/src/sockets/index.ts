import { Server as SocketIOServer, Socket } from 'socket.io'
import cookie from 'cookie'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import prisma from '../config/database'
import logger from '../utils/logger'

interface AuthenticatedSocket extends Socket {
  user?: TokenPayload
}

function extractUser(socketCookies: string | undefined): TokenPayload | null {
  if (!socketCookies) return null
  try {
    const parsed = cookie.parse(socketCookies)
    const token = parsed['accessToken']
    if (!token) return null
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

export function registerSocketHandlers(io: SocketIOServer) {
  // Auth middleware — runs before every connection
  io.use((socket: AuthenticatedSocket, next) => {
    const cookieHeader = socket.handshake.headers.cookie
    const user = extractUser(cookieHeader)
    if (!user) {
      return next(new Error('Authentication required'))
    }
    socket.user = user
    next()
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user!
    logger.info(`Socket connected: ${socket.id} (user: ${user.userId})`)

    // Join personal notification room
    socket.join(`user:${user.userId}`)

    // Emit online status to all rooms this user participates in
    socket.broadcast.emit('user:online', { userId: user.userId, online: true })

    // ── Conversation rooms ───────────────────────────────────────────
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`)
      logger.debug(`${user.userId} joined conversation:${conversationId}`)
    })

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`)
    })

    // ── Typing indicator ─────────────────────────────────────────────
    socket.on('user:typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId: user.userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      })
    })

    // ── Send message ─────────────────────────────────────────────────
    socket.on(
      'message:send',
      async (data: {
        conversationId: string
        content?: string
        recipientId: string
        mediaUrl?: string
        mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'
      }) => {
        try {
          const { conversationId, content, recipientId, mediaUrl, mediaType } = data

          if (!content && !mediaUrl) return

          // Verify sender is a participant
          const participant = await prisma.conversationParticipant.findUnique({
            where: {
              conversationId_userId: { conversationId, userId: user.userId },
            },
          })
          if (!participant) return

          const message = await prisma.message.create({
            data: {
              conversationId,
              senderId: user.userId,
              recipientId,
              content,
              mediaUrl,
              mediaType,
            },
            include: {
              sender: {
                select: { id: true, name: true, avatar: true },
              },
            },
          })

          // Emit to everyone in the conversation room (including sender for confirmation)
          io.to(`conversation:${conversationId}`).emit('message:new', message)

          // Push notification to recipient's personal room
          io.to(`user:${recipientId}`).emit('notification:new', {
            type: 'MESSAGE',
            title: 'New message',
            body: content ?? 'Sent you a media message',
            metadata: { conversationId, senderId: user.userId },
          })
        } catch (err) {
          logger.error({ message: 'socket message:send error', error: err })
          socket.emit('message:error', { message: 'Failed to send message' })
        }
      }
    )

    // ── Mark message as read ─────────────────────────────────────────
    socket.on('message:markRead', async (data: { messageId: string; conversationId: string }) => {
      try {
        const { messageId, conversationId } = data

        await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        })

        // Notify the sender that their message was read
        socket.to(`conversation:${conversationId}`).emit('message:read', {
          messageId,
          conversationId,
          readBy: user.userId,
        })
      } catch (err) {
        logger.error({ message: 'socket message:markRead error', error: err })
      }
    })

    // ── Mark all messages in conversation as read ────────────────────
    socket.on('conversation:markAllRead', async (conversationId: string) => {
      try {
        await prisma.message.updateMany({
          where: { conversationId, recipientId: user.userId, isRead: false },
          data: { isRead: true },
        })

        socket.to(`conversation:${conversationId}`).emit('conversation:allRead', {
          conversationId,
          readBy: user.userId,
        })
      } catch (err) {
        logger.error({ message: 'socket conversation:markAllRead error', error: err })
      }
    })

    // ── Disconnect ───────────────────────────────────────────────────
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id} (user: ${user.userId})`)
      socket.broadcast.emit('user:online', { userId: user.userId, online: false })
    })
  })
}
