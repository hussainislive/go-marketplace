// ── Enums (mirror Prisma) ────────────────────────────────────────────────────
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING'
export type Condition = 'NEW' | 'USED' | 'REFURBISHED'
export type AdStatus = 'ACTIVE' | 'SOLD' | 'DEACTIVATED' | 'PENDING'
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'
export type NotificationType = 'MESSAGE' | 'FAVORITE' | 'LISTING_UPDATE' | 'ADMIN_ANNOUNCEMENT'
export type ReportReason = 'SPAM' | 'FRAUD' | 'INAPPROPRIATE' | 'FAKE_LISTING' | 'HARASSMENT' | 'OTHER'
export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

// ── API envelope ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginationMeta
}

// ── Domain models ────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  icon: string
  slug: string
  _count?: { ads: number }
}

export interface AdSeller {
  id: string
  name: string
  avatar: string | null
  isVerified: boolean
  city: string | null
}

export interface Ad {
  id: string
  title: string
  description: string
  price: string
  negotiable: boolean
  condition: Condition
  status: AdStatus
  isFeatured: boolean
  views: number
  images: string[]
  city: string
  categoryId: string
  userId: string
  createdAt: string
  updatedAt: string
  category?: Category
  user?: AdSeller
  _count?: { favorites: number }
}

export interface UserProfile {
  id: string
  email?: string
  name: string
  phone?: string | null
  avatar: string | null
  coverImage: string | null
  bio: string | null
  city: string | null
  isVerified: boolean
  role?: UserRole
  status?: UserStatus
  createdAt: string
  updatedAt?: string
  _count?: { ads: number; favorites?: number }
}

export interface DashboardStats {
  activeAds: number
  soldAds: number
  totalViews: number
  unreadMessages: number
}

export interface ConversationParticipant {
  conversationId: string
  userId: string
  user: { id: string; name: string; avatar: string | null; isVerified: boolean }
}

export interface ConversationLastMessage {
  id: string
  content: string | null
  createdAt: string
  isRead: boolean
  senderId: string
}

export interface Conversation {
  id: string
  adId: string | null
  createdAt: string
  participants: ConversationParticipant[]
  messages: ConversationLastMessage[]
}

export interface Message {
  id: string
  content: string | null
  mediaUrl: string | null
  mediaType: MediaType | null
  isRead: boolean
  conversationId: string
  senderId: string
  recipientId: string | null
  createdAt: string
  sender: { id: string; name: string; avatar: string | null }
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  metadata: Record<string, unknown> | null
  userId: string
  createdAt: string
}

export interface Report {
  id: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  priority: Priority
  reportedById: string
  adId: string | null
  createdAt: string
  updatedAt: string
  reportedBy?: { id: string; name: string; email?: string }
  ad?: { id: string; title: string } | null
}

export interface AdminStats {
  totalUsers: number
  totalAds: number
  activeAds: number
  pendingReports: number
  adsByCategory: Array<{ name: string; _count: { ads: number } }>
  recentUsers: Array<{ createdAt: string; _count: { id: number } }>
}

export interface AdminUser {
  id: string
  email: string
  name: string
  avatar: string | null
  role: UserRole
  status: UserStatus
  isVerified: boolean
  city: string | null
  createdAt: string
  _count?: { ads: number }
}
