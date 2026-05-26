import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type { ApiResponse, PaginatedResponse, Conversation, Message } from '../types'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Conversation[]>>('/conversations')
      return data.data
    },
  })
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Message>>(
        `/conversations/${conversationId}/messages`,
        { params: { limit: 100 } }
      )
      return data.data
    },
  })
}

export interface StartConversationPayload {
  otherUserId: string
  adId?: string
  initialMessage: string
}

export function useStartConversation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: StartConversationPayload) => {
      const { data } = await api.post<ApiResponse<{ conversation: Conversation; message: Message }>>(
        '/conversations',
        payload
      )
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// Persist message via REST (socket handles realtime broadcast)
export function useSendMessage(conversationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { content?: string; media?: File; mediaType?: string }) => {
      const fd = new FormData()
      if (payload.content) fd.append('content', payload.content)
      if (payload.media) fd.append('media', payload.media)
      if (payload.mediaType) fd.append('mediaType', payload.mediaType)
      const { data } = await api.post<ApiResponse<Message>>(
        `/conversations/${conversationId}/messages`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['messages', conversationId] })
      void qc.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
