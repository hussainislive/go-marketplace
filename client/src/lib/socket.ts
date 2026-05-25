import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string

// Do NOT auto-connect — connect only when user is authenticated
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
})

export function connectSocket() {
  if (!socket.connected) {
    socket.connect()
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect()
  }
}

// Typed event emitters for type safety across the app
export const socketEvents = {
  joinConversation: (conversationId: string) =>
    socket.emit('conversation:join', conversationId),

  leaveConversation: (conversationId: string) =>
    socket.emit('conversation:leave', conversationId),

  sendMessage: (data: {
    conversationId: string
    content?: string
    recipientId: string
    mediaUrl?: string
    mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'
  }) => socket.emit('message:send', data),

  markRead: (messageId: string, conversationId: string) =>
    socket.emit('message:markRead', { messageId, conversationId }),

  markAllRead: (conversationId: string) =>
    socket.emit('conversation:markAllRead', conversationId),

  typing: (conversationId: string, isTyping: boolean) =>
    socket.emit('user:typing', { conversationId, isTyping }),
}
