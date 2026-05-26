import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminAds, useAdminDeleteAd, useFeatureAd } from '../../api/admin'
import { Tabs } from '../../components/ui/Tabs'
import { Badge } from '../../components/ui/Badge'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatPrice, formatDate, cn } from '../../utils/format'
import type { Ad } from '../../types'

const TABS = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'DEACTIVATED', label: 'Deactivated' },
]

export default function AdminListingsPage() {
  const [tab, setTab] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null)

  const ads = useAdminAds(tab || undefined)
  const deleteAd = useAdminDeleteAd()
  const featureAd = useFeatureAd()

  async function toggleFeature(ad: Ad) {
    try {
      await featureAd.mutateAsync({ id: ad.id, isFeatured: !ad.isFeatured })
      toast.success(ad.isFeatured ? 'Removed from featured' : 'Marked as featured')
    } catch {
      toast.error('Action failed')
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteAd.mutateAsync(deleteTarget.id)
      toast.success('Listing removed')
      setDeleteTarget(null)
    } catch {
      toast.error('Could not remove listing')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Listings</h1>
      <Tabs tabs={TABS} value={tab} onChange={setTab} className="mb-6" />

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-left text-label font-semibold text-text-primary/60">
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border-divider"><td className="px-5 py-3" colSpan={5}><Skeleton variant="text" className="h-8" /></td></tr>
                ))
              ) : (
                ads.data?.data.map(ad => (
                  <tr key={ad.id} className="border-b border-border-divider hover:bg-background-soft">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-background-soft shrink-0">
                          {ad.images[0] && <img src={ad.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-body font-medium text-text-primary truncate max-w-[220px]">{ad.title}</p>
                          {ad.isFeatured && <Badge variant="gradient" className="mt-1">Featured</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-body font-semibold text-brand-gradient">{formatPrice(ad.price)}</td>
                    <td className="px-5 py-3"><Badge variant={ad.status === 'ACTIVE' ? 'success' : 'default'}>{ad.status.toLowerCase()}</Badge></td>
                    <td className="px-5 py-3 text-body text-text-primary/60">{formatDate(ad.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFeature(ad)}
                          title={ad.isFeatured ? 'Unfeature' : 'Feature'}
                          className={cn('p-2 rounded-full hover:bg-background-soft', ad.isFeatured ? 'text-brand-pink' : 'text-text-primary/50')}
                        >
                          <Star size={18} className={ad.isFeatured ? 'fill-brand-pink' : ''} />
                        </button>
                        <Link to={`/ads/${ad.id}`} className="p-2 rounded-full hover:bg-background-soft text-text-primary/60" title="View">
                          <ExternalLink size={18} />
                        </Link>
                        <button onClick={() => setDeleteTarget(ad)} className="p-2 rounded-full hover:bg-background-soft text-status-error" title="Remove">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Remove listing?"
        description={`"${deleteTarget?.title}" will be permanently removed from the marketplace.`}
        confirmLabel="Remove"
        destructive
        loading={deleteAd.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
