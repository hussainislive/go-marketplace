import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Send, Paperclip, Mic, Trash2, MessageSquare, LayoutDashboard } from 'lucide-react'
import { useConversations, useMessages, useSendMessage } from '../../api/conversations'
import { useAppSelector } from '../../store/hooks'
import { socket, socketEvents } from '../../lib/socket'
import { Avatar } from '../../components/ui/Avatar'
import { EmptyState } from '../../components/shared/EmptyState'
import { Logo } from '../../components/shared/Logo'
import { Spinner } from '../../components/ui/Spinner'
import { useVoiceRecorder } from '../../utils/useVoiceRecorder'
import { formatRelativeTime, formatDuration, cn } from '../../utils/format'
import type { Message } from '../../types'

export default function MessagesPage() {
  const [params, setParams] = useSearchParams()
  const qc = useQueryClient()
  const { user } = useAppSelector(s => s.auth)
  const activeId = params.get('conv') ?? undefined

  const conversations = useConversations()
  const messages = useMessages(activeId)
  const sendMessage = useSendMessage(activeId ?? '')

  const [text, setText] = useState('')
  const [typingPeer, setTypingPeer] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const recorder = useVoiceRecorder()

  const activeConv = conversations.data?.find(c => c.id === activeId)
  const otherParticipant = activeConv?.participants.find(p => p.userId !== user?.id)?.user

  // Realtime: join room + listen for incoming messages / typing
  useEffect(() => {
    if (!activeId) return
    socketEvents.joinConversation(activeId)

    const onNew = (msg: Message) => {
      if (msg.conversationId === activeId) {
        qc.setQueryData<Message[]>(['messages', activeId], old => {
          if (!old) return [msg]
          if (old.some(m => m.id === msg.id)) return old
          return [...old, msg]
        })
      }
      void qc.invalidateQueries({ queryKey: ['conversations'] })
    }
    const onTyping = (data: { conversationId: string; isTyping: boolean; userId: string }) => {
      if (data.conversationId === activeId && data.userId !== user?.id) setTypingPeer(data.isTyping)
    }

    socket.on('message:new', onNew)
    socket.on('user:typing', onTyping)
    return () => {
      socketEvents.leaveConversation(activeId)
      socket.off('message:new', onNew)
      socket.off('user:typing', onTyping)
      setTypingPeer(false)
    }
  }, [activeId, qc, user?.id])

  // Auto-scroll to newest
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.data, typingPeer])

  function sendText() {
    const content = text.trim()
    if (!content || !activeId || !otherParticipant) return
    setText('')
    socketEvents.typing(activeId, false)
    // Server persists to DB and broadcasts message:new back to this room,
    // which our onNew handler appends — single source of truth, no double write.
    socketEvents.sendMessage({ conversationId: activeId, content, recipientId: otherParticipant.id })
  }

  async function sendFile(file: File, mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE') {
    if (!activeId) return
    // REST upload (Cloudinary) persists the media message and returns it;
    // append directly so the sender sees it immediately.
    const msg = await sendMessage.mutateAsync({ media: file, mediaType })
    qc.setQueryData<Message[]>(['messages', activeId], old => {
      if (!old) return [msg]
      if (old.some(m => m.id === msg.id)) return old
      return [...old, msg]
    })
  }

  async function handleStopRecording() {
    const file = await recorder.stop()
    if (file) await sendFile(file, 'VOICE_NOTE')
  }

  function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const type = f.type.startsWith('image') ? 'IMAGE' : f.type.startsWith('video') ? 'VIDEO' : 'AUDIO'
    void sendFile(f, type)
    e.target.value = ''
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-text-primary/70 hover:text-text-primary">
          <LayoutDashboard size={18} />
          <span className="text-body font-medium hidden sm:inline">Dashboard</span>
        </Link>
        <Link to="/"><Logo className="h-10 md:h-12" /></Link>
        <div className="w-8" />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Conversation list */}
        <div className={cn('w-full lg:w-[340px] border-r border-border bg-white flex flex-col', activeId && 'hidden lg:flex')}>
          <div className="h-14 px-5 flex items-center border-b border-border shrink-0">
            <h1 className="text-card-title font-semibold">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {conversations.isLoading ? (
              <div className="p-5"><Spinner /></div>
            ) : conversations.data && conversations.data.length > 0 ? (
              conversations.data.map(conv => {
                const other = conv.participants.find(p => p.userId !== user?.id)?.user
                const last = conv.messages[0]
                const isActive = conv.id === activeId
                return (
                  <button
                    key={conv.id}
                    onClick={() => setParams({ conv: conv.id })}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 border-b border-border-divider text-left hover:bg-background-soft transition-colors',
                      isActive && 'bg-brand-pink/5'
                    )}
                  >
                    <Avatar src={other?.avatar} name={other?.name ?? 'U'} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-text-primary truncate">{other?.name ?? 'Unknown'}</p>
                      <p className="text-caption text-text-primary/50 truncate">{last?.content ?? '📎 Media message'}</p>
                    </div>
                    {last && <span className="text-[11px] text-text-primary/40 shrink-0">{formatRelativeTime(last.createdAt)}</span>}
                  </button>
                )
              })
            ) : (
              <div className="p-6">
                <EmptyState icon={MessageSquare} title="No conversations" description="Start chatting with sellers from any listing." />
              </div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className={cn('flex-1 flex flex-col min-w-0', !activeId && 'hidden lg:flex')}>
          {activeConv && otherParticipant ? (
            <>
              <div className="h-14 px-4 flex items-center gap-3 border-b border-border bg-white shrink-0">
                <button onClick={() => setParams({})} className="lg:hidden p-1.5 -ml-1.5"><ArrowLeft size={20} /></button>
                <Avatar src={otherParticipant.avatar} name={otherParticipant.name} size="sm" />
                <div>
                  <p className="text-body font-semibold text-text-primary">{otherParticipant.name}</p>
                  {typingPeer && <p className="text-caption text-brand-pink">typing…</p>}
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2 bg-background-soft">
                {messages.isLoading ? (
                  <div className="flex justify-center pt-8"><Spinner /></div>
                ) : messages.data && messages.data.length > 0 ? (
                  messages.data.map(msg => {
                    const mine = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-card',
                            mine ? 'bg-brand-gradient text-white rounded-br-sm' : 'bg-white text-text-primary rounded-bl-sm'
                          )}
                        >
                          {msg.mediaType === 'IMAGE' && msg.mediaUrl && (
                            <img src={msg.mediaUrl} alt="" className="rounded-lg max-w-full mb-1 max-h-64 object-cover" />
                          )}
                          {(msg.mediaType === 'VOICE_NOTE' || msg.mediaType === 'AUDIO') && msg.mediaUrl && (
                            <audio controls src={msg.mediaUrl} className="max-w-[240px]" />
                          )}
                          {msg.mediaType === 'VIDEO' && msg.mediaUrl && (
                            <video controls src={msg.mediaUrl} className="rounded-lg max-w-full mb-1 max-h-64" />
                          )}
                          {msg.content && <p className="text-body whitespace-pre-line break-words">{msg.content}</p>}
                          <p className={cn('text-[10px] mt-1', mine ? 'text-white/70' : 'text-text-primary/40')}>
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-body text-text-primary/40">
                    Say hello 👋
                  </div>
                )}
                {typingPeer && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-card rounded-2xl rounded-bl-sm px-4 py-3">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-text-primary/40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-text-primary/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 bg-text-primary/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="p-3 border-t border-border bg-white shrink-0">
                {recorder.recording ? (
                  <div className="flex items-center gap-3 px-2">
                    <span className="w-3 h-3 rounded-full bg-status-error animate-pulse" />
                    <span className="text-body text-text-primary flex-1">Recording… {formatDuration(recorder.seconds)}</span>
                    <button onClick={recorder.cancel} className="p-2 text-status-error" title="Cancel"><Trash2 size={20} /></button>
                    <button onClick={handleStopRecording} className="w-11 h-11 rounded-full bg-brand-gradient text-white flex items-center justify-center" title="Send voice note"><Send size={18} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label className="p-2.5 rounded-full hover:bg-background-soft cursor-pointer text-text-primary/60" title="Attach media">
                      <Paperclip size={20} />
                      <input type="file" accept="image/*,video/*,audio/*" className="hidden" onChange={onFilePick} />
                    </label>
                    <input
                      value={text}
                      onChange={e => {
                        setText(e.target.value)
                        if (activeId) socketEvents.typing(activeId, e.target.value.length > 0)
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendText()
                        }
                      }}
                      placeholder="Type a message…"
                      className="flex-1 h-11 px-4 rounded-badge bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink"
                    />
                    {text.trim() ? (
                      <button onClick={sendText} className="w-11 h-11 rounded-full bg-brand-gradient text-white flex items-center justify-center active:scale-95" title="Send">
                        <Send size={18} />
                      </button>
                    ) : (
                      <button onClick={() => void recorder.start()} className="w-11 h-11 rounded-full bg-brand-gradient text-white flex items-center justify-center active:scale-95" title="Record voice note">
                        <Mic size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <EmptyState icon={MessageSquare} title="Select a conversation" description="Choose a chat from the list to start messaging." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
