import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Flag, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useReports, useUpdateReportStatus } from '../../api/reports'
import { Tabs } from '../../components/ui/Tabs'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { formatRelativeTime } from '../../utils/format'
import type { Report, ReportStatus, Priority } from '../../types'

const TABS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DISMISSED', label: 'Dismissed' },
]
const statusVariant: Record<ReportStatus, 'warning' | 'info' | 'success' | 'default'> = {
  PENDING: 'warning',
  UNDER_REVIEW: 'info',
  RESOLVED: 'success',
  DISMISSED: 'default',
}
const priorityVariant: Record<Priority, 'default' | 'warning' | 'error'> = {
  LOW: 'default',
  MEDIUM: 'warning',
  HIGH: 'error',
}

export default function AdminReportsPage() {
  const [tab, setTab] = useState<ReportStatus | ''>('')
  const [selected, setSelected] = useState<Report | null>(null)

  const reports = useReports(tab || undefined)
  const updateStatus = useUpdateReportStatus()

  async function setStatus(status: ReportStatus) {
    if (!selected) return
    try {
      await updateStatus.mutateAsync({ id: selected.id, status })
      toast.success(`Report ${status.toLowerCase().replace('_', ' ')}`)
      setSelected(null)
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Reports & Moderation</h1>
      <Tabs tabs={TABS} value={tab} onChange={v => setTab(v as ReportStatus | '')} className="mb-6" />

      {reports.isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="row" />)}</div>
      ) : reports.data && reports.data.data.length > 0 ? (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-border text-left text-label font-semibold text-text-primary/60">
                  <th className="px-5 py-3">Reported item</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.data.data.map(r => (
                  <tr key={r.id} className="border-b border-border-divider hover:bg-background-soft">
                    <td className="px-5 py-3 text-body font-medium text-text-primary truncate max-w-[200px]">{r.ad?.title ?? 'Deleted listing'}</td>
                    <td className="px-5 py-3 text-body text-text-primary/70 capitalize">{r.reason.toLowerCase().replace('_', ' ')}</td>
                    <td className="px-5 py-3"><Badge variant={priorityVariant[r.priority]}>{r.priority.toLowerCase()}</Badge></td>
                    <td className="px-5 py-3"><Badge variant={statusVariant[r.status]}>{r.status.toLowerCase().replace('_', ' ')}</Badge></td>
                    <td className="px-5 py-3 text-caption text-text-primary/50">{formatRelativeTime(r.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="secondary" onClick={() => setSelected(r)}>Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={Flag} title="No reports" description="Reported listings will appear here for moderation." />
      )}

      {/* Slide-in detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-modal overflow-y-auto"
              initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-card-title font-semibold">Report detail</h2>
                <button onClick={() => setSelected(null)} className="p-2 -mr-2 text-text-primary/50 hover:text-text-primary"><X size={22} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex gap-2">
                  <Badge variant={statusVariant[selected.status]}>{selected.status.toLowerCase().replace('_', ' ')}</Badge>
                  <Badge variant={priorityVariant[selected.priority]}>{selected.priority.toLowerCase()} priority</Badge>
                </div>

                <Field label="Reason" value={selected.reason.toLowerCase().replace('_', ' ')} capitalize />
                {selected.description && <Field label="Description" value={selected.description} />}
                <Field label="Reported by" value={selected.reportedBy?.name ?? 'Unknown'} />
                <Field label="Reported on" value={formatRelativeTime(selected.createdAt)} />

                {selected.ad && (
                  <div>
                    <p className="text-label font-semibold text-text-primary/60 mb-1.5">Reported listing</p>
                    <Link to={`/ads/${selected.ad.id}`} className="flex items-center gap-2 text-body text-brand-pink hover:underline">
                      {selected.ad.title} <ExternalLink size={15} />
                    </Link>
                  </div>
                )}

                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-label font-semibold text-text-primary/60">Take action</p>
                  <Button fullWidth onClick={() => setStatus('UNDER_REVIEW')} loading={updateStatus.isPending}>Mark under review</Button>
                  <Button fullWidth variant="secondary" onClick={() => setStatus('RESOLVED')} loading={updateStatus.isPending}>Resolve report</Button>
                  <Button fullWidth variant="ghost" onClick={() => setStatus('DISMISSED')} loading={updateStatus.isPending}>Dismiss</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-label font-semibold text-text-primary/60 mb-1">{label}</p>
      <p className={`text-body text-text-primary ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  )
}
