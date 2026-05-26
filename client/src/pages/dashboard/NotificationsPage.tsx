import { useState } from 'react'
import { MessageCircle, Heart, Package, Megaphone, Bell, CheckCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '../../api/notifications'
import { Tabs } from '../../components/ui/Tabs'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { formatRelativeTime, cn } from '../../utils/format'
import type { NotificationType } from '../../types'

const TABS = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'MESSAGE', label: 'Messages' },
  { value: 'LISTING_UPDATE', label: 'Updates' },
]

const iconFor: Record<NotificationType, LucideIcon> = {
  MESSAGE: MessageCircle,
  FAVORITE: Heart,
  LISTING_UPDATE: Package,
  ADMIN_ANNOUNCEMENT: Megaphone,
}

export default function NotificationsPage() {
  const [tab, setTab] = useState('')
  const notifications = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllRead()

  const filtered = (notifications.data ?? []).filter(n => {
    if (tab === '') return true
    if (tab === 'unread') return !n.isRead
    return n.type === tab
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
        <Button variant="ghost" size="sm" leftIcon={<CheckCheck size={16} />} loading={markAll.isPending} onClick={() => markAll.mutate()}>
          Mark all read
        </Button>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {notifications.isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="row" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(n => {
            const Icon = iconFor[n.type]
            return (
              <button
                key={n.id}
                onClick={() => !n.isRead && markRead.mutate(n.id)}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-card text-left transition-colors',
                  n.isRead ? 'bg-white' : 'bg-brand-pink/5 hover:bg-brand-pink/10'
                )}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', n.isRead ? 'bg-background-soft text-text-primary/50' : 'bg-brand-gradient text-white')}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-semibold text-text-primary">{n.title}</p>
                  <p className="text-caption text-text-primary/60 mt-0.5">{n.body}</p>
                  <p className="text-[11px] text-text-primary/40 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-brand-pink shrink-0 mt-1" />}
              </button>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up. New activity will appear here." />
      )}
    </div>
  )
}
