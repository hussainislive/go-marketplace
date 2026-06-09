import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Eye, Calendar, Heart, Flag, MessageCircle, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAd, useToggleFavorite } from '../../api/ads'
import { useFavorites } from '../../api/favorites'
import { useStartConversation } from '../../api/conversations'
import { useCreateReport } from '../../api/reports'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { openAuthModal } from '../../store/uiSlice'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { VerifiedBadge } from '../../components/shared/VerifiedBadge'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatPrice, formatRelativeTime, cn, cdnImage } from '../../utils/format'
import type { ReportReason } from '../../types'

const REPORT_REASONS = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Fraud / Scam' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { value: 'FAKE_LISTING', label: 'Fake listing' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'OTHER', label: 'Other' },
]

export default function AdDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector(s => s.auth)
  const { data: ad, isLoading } = useAd(id)
  const { data: favorites } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const startConversation = useStartConversation()
  const createReport = useCreateReport()

  const [activeImage, setActiveImage] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [favorited, setFavorited] = useState(false)

  // Sync favorited state once favorites list and ad are both loaded
  useEffect(() => {
    if (favorites && id) {
      setFavorited(favorites.some(f => f.id === id))
    }
  }, [favorites, id])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState<ReportReason>('SPAM')
  const [reportDesc, setReportDesc] = useState('')

  if (isLoading) {
    return (
      <div className="max-w-container mx-auto px-5 md:px-margin-desktop py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton variant="rect" className="aspect-16/10 rounded-card" />
          <Skeleton variant="text" className="h-8 w-2/3" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
        </div>
        <Skeleton variant="rect" className="h-80 rounded-card" />
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="max-w-container mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Listing not found</h1>
        <Link to="/search"><Button className="mt-6">Browse listings</Button></Link>
      </div>
    )
  }

  const isOwner = user?.id === ad.userId

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'))
      return
    }
    action()
  }

  function handleFavorite() {
    requireAuth(() => {
      const prev = favorited
      setFavorited(!prev)
      toggleFavorite.mutate({ adId: ad!.id, favorited: prev }, { onError: () => setFavorited(prev) })
    })
  }

  async function submitChat() {
    if (!chatMsg.trim() || !ad?.user) return
    try {
      const res = await startConversation.mutateAsync({
        otherUserId: ad.user.id,
        adId: ad.id,
        initialMessage: chatMsg.trim(),
      })
      setChatOpen(false)
      toast.success('Message sent!')
      navigate(`/messages?conv=${res.conversation.id}`)
    } catch {
      toast.error('Could not start conversation')
    }
  }

  async function submitReport() {
    try {
      await createReport.mutateAsync({ adId: ad!.id, reason: reportReason, description: reportDesc || undefined })
      setReportOpen(false)
      setReportDesc('')
      toast.success('Report submitted. Thank you.')
    } catch {
      toast.error('Could not submit report')
    }
  }

  const images = ad.images.length > 0 ? ad.images : []

  return (
    <div className="max-w-container mx-auto px-5 md:px-margin-desktop py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="text-caption text-text-primary/50 mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-pink">Home</Link>
        <span>/</span>
        {ad.category && (
          <>
            <Link to={`/search?category=${ad.category.slug}`} className="hover:text-brand-pink">{ad.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-text-primary/70 truncate">{ad.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — gallery + description */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div
              className="relative aspect-16/10 bg-background-soft cursor-zoom-in"
              onClick={() => images.length > 0 && setLightbox(true)}
            >
              {images[activeImage] ? (
                <img
                  src={cdnImage(images[activeImage], 900)}
                  alt={ad.title}
                  width={900}
                  height={563}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-primary/30">No image</div>
              )}
              {ad.isFeatured && <div className="absolute top-4 left-4"><Badge variant="gradient">Featured</Badge></div>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors',
                      i === activeImage ? 'border-brand-pink' : 'border-transparent'
                    )}
                  >
                    <img src={cdnImage(img, 160)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-card shadow-card p-6 mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{ad.title}</h1>
                <div className="flex items-center gap-4 text-caption text-text-primary/55 mt-2">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {ad.city}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {formatRelativeTime(ad.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={14} /> {ad.views} views</span>
                </div>
              </div>
              <Badge variant={ad.condition === 'NEW' ? 'success' : 'default'}>
                {ad.condition.charAt(0) + ad.condition.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-brand-gradient mt-4">{formatPrice(ad.price)}</p>
            {ad.negotiable && <p className="text-caption text-text-primary/50 mt-1">Negotiable</p>}

            <hr className="my-6 border-border-divider" />
            <h2 className="text-card-title font-semibold mb-3">Description</h2>
            <p className="text-body text-text-primary/75 whitespace-pre-line leading-relaxed">{ad.description}</p>
          </div>
        </div>

        {/* Right — seller card (sticky) */}
        <div className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="bg-white rounded-card shadow-card p-6">
            {ad.user && (
              <Link to={`/profile`} className="flex items-center gap-3">
                <Avatar src={ad.user.avatar} name={ad.user.name} size="lg" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-card-title font-semibold text-text-primary">{ad.user.name}</p>
                    {ad.user.isVerified && <VerifiedBadge />}
                  </div>
                  <p className="text-caption text-text-primary/50">{ad.user.city ?? 'GO Marketplace seller'}</p>
                </div>
              </Link>
            )}

            <div className="space-y-3 mt-6">
              {!isOwner && (
                <Button fullWidth size="lg" leftIcon={<MessageCircle size={18} />} onClick={() => requireAuth(() => setChatOpen(true))}>
                  Chat with Seller
                </Button>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth leftIcon={<Heart size={18} className={favorited ? 'fill-brand-pink text-brand-pink' : ''} />} onClick={handleFavorite}>
                  {favorited ? 'Saved' : 'Save'}
                </Button>
                {!isOwner && (
                  <Button variant="secondary" leftIcon={<Flag size={18} />} onClick={() => requireAuth(() => setReportOpen(true))}>
                    Report
                  </Button>
                )}
              </div>
              {isOwner && (
                <Link to={`/dashboard/ads/${ad.id}/edit`}>
                  <Button variant="secondary" fullWidth>Edit your listing</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-card shadow-card p-5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-status-success shrink-0 mt-0.5" />
            <div>
              <p className="text-body font-semibold text-text-primary">Safety tips</p>
              <p className="text-caption text-text-primary/55 mt-0.5">Meet in a public place, inspect the item before paying, and never wire money in advance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 text-white p-2" onClick={() => setLightbox(false)}><X size={28} /></button>
          {images.length > 1 && (
            <button
              className="absolute left-5 text-white p-2"
              onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + images.length) % images.length) }}
            >
              <ChevronLeft size={32} />
            </button>
          )}
          <img src={images[activeImage]} alt={ad.title} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />
          {images.length > 1 && (
            <button
              className="absolute right-5 text-white p-2"
              onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % images.length) }}
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* Chat modal */}
      <Modal open={chatOpen} onOpenChange={setChatOpen} title="Message the seller" className="sm:max-w-md">
        <p className="text-body text-text-primary/60 -mt-2 mb-4">About: <span className="font-medium text-text-primary">{ad.title}</span></p>
        <textarea
          value={chatMsg}
          onChange={e => setChatMsg(e.target.value)}
          rows={4}
          placeholder="Hi, is this still available?"
          className="w-full p-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink resize-none"
        />
        <Button fullWidth className="mt-4" loading={startConversation.isPending} onClick={submitChat}>Send message</Button>
      </Modal>

      {/* Report modal */}
      <Modal open={reportOpen} onOpenChange={setReportOpen} title="Report this listing" className="sm:max-w-md">
        <div className="space-y-4">
          <Select label="Reason" options={REPORT_REASONS} value={reportReason} onChange={e => setReportReason(e.target.value as ReportReason)} />
          <div>
            <label className="block text-label font-semibold text-text-primary mb-1.5">Details (optional)</label>
            <textarea
              value={reportDesc}
              onChange={e => setReportDesc(e.target.value)}
              rows={3}
              placeholder="Tell us more..."
              className="w-full p-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink resize-none"
            />
          </div>
          <Button variant="danger" fullWidth loading={createReport.isPending} onClick={submitReport}>Submit report</Button>
        </div>
      </Modal>
    </div>
  )
}
