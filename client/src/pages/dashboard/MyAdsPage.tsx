import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Eye, MoreVertical, PlusCircle, PackageOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMyAds, useDeleteAd, useUpdateAdStatus } from '../../api/ads'
import { Tabs } from '../../components/ui/Tabs'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { formatPrice, formatRelativeTime } from '../../utils/format'
import type { Ad, AdStatus } from '../../types'

const TABS = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'DEACTIVATED', label: 'Deactivated' },
]

const statusVariant: Record<string, 'success' | 'info' | 'default'> = {
  ACTIVE: 'success',
  SOLD: 'info',
  DEACTIVATED: 'default',
}

export default function MyAdsPage() {
  const [tab, setTab] = useState('')
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [deleteFor, setDeleteFor] = useState<Ad | null>(null)

  const myAds = useMyAds(tab || undefined)
  const deleteAd = useDeleteAd()
  const updateStatus = useUpdateAdStatus()

  async function changeStatus(ad: Ad, status: AdStatus) {
    setMenuFor(null)
    try {
      await updateStatus.mutateAsync({ id: ad.id, status })
      toast.success(`Marked as ${status.toLowerCase()}`)
    } catch {
      toast.error('Could not update status')
    }
  }

  async function confirmDelete() {
    if (!deleteFor) return
    try {
      await deleteAd.mutateAsync(deleteFor.id)
      toast.success('Listing deleted')
      setDeleteFor(null)
    } catch {
      toast.error('Could not delete listing')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Ads</h1>
        <Link to="/dashboard/create">
          <Button leftIcon={<PlusCircle size={18} />}>Post an Ad</Button>
        </Link>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      {myAds.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="row" className="h-24" />)}
        </div>
      ) : myAds.data && myAds.data.data.length > 0 ? (
        <div className="space-y-3">
          {myAds.data.data.map(ad => (
            <div key={ad.id} className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
              <Link to={`/ads/${ad.id}`} className="w-24 h-20 rounded-lg overflow-hidden bg-background-soft shrink-0">
                {ad.images[0] ? (
                  <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-caption text-text-primary/30">No image</div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/ads/${ad.id}`} className="text-body font-semibold text-text-primary truncate hover:text-brand-pink">{ad.title}</Link>
                  <Badge variant={statusVariant[ad.status] ?? 'default'}>{ad.status.toLowerCase()}</Badge>
                </div>
                <p className="text-card-title font-bold text-brand-gradient mt-0.5">{formatPrice(ad.price)}</p>
                <div className="flex items-center gap-3 text-caption text-text-primary/50 mt-1">
                  <span className="flex items-center gap-1"><Eye size={13} /> {ad.views}</span>
                  <span>· {formatRelativeTime(ad.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link to={`/dashboard/ads/${ad.id}/edit`} className="p-2.5 rounded-full hover:bg-background-soft text-text-primary/60" title="Edit">
                  <Pencil size={18} />
                </Link>
                <button onClick={() => setDeleteFor(ad)} className="p-2.5 rounded-full hover:bg-background-soft text-status-error" title="Delete">
                  <Trash2 size={18} />
                </button>
                <div className="relative">
                  <button onClick={() => setMenuFor(menuFor === ad.id ? null : ad.id)} className="p-2.5 rounded-full hover:bg-background-soft text-text-primary/60">
                    <MoreVertical size={18} />
                  </button>
                  {menuFor === ad.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-card shadow-card-hover border border-border py-1.5 z-20">
                        {ad.status !== 'ACTIVE' && (
                          <button onClick={() => changeStatus(ad, 'ACTIVE')} className="w-full text-left px-4 py-2 text-body hover:bg-background-soft">Mark as Active</button>
                        )}
                        {ad.status !== 'SOLD' && (
                          <button onClick={() => changeStatus(ad, 'SOLD')} className="w-full text-left px-4 py-2 text-body hover:bg-background-soft">Mark as Sold</button>
                        )}
                        {ad.status !== 'DEACTIVATED' && (
                          <button onClick={() => changeStatus(ad, 'DEACTIVATED')} className="w-full text-left px-4 py-2 text-body hover:bg-background-soft">Deactivate</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageOpen}
          title="No listings here"
          description="When you post ads, they'll show up in this list."
          ctaLabel="Post your first ad"
          ctaHref="/dashboard/create"
        />
      )}

      <ConfirmModal
        open={!!deleteFor}
        onOpenChange={open => !open && setDeleteFor(null)}
        title="Delete listing?"
        description={`"${deleteFor?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteAd.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
