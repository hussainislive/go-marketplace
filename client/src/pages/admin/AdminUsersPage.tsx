import { useState } from 'react'
import { Search, Ban, Trash2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminUsers, useUpdateUserStatus, useDeleteUser } from '../../api/admin'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate, cn } from '../../utils/format'
import type { AdminUser, UserStatus } from '../../types'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'BANNED', label: 'Banned' },
  { value: 'PENDING', label: 'Pending' },
]
const statusVariant: Record<UserStatus, 'success' | 'error' | 'warning'> = {
  ACTIVE: 'success',
  BANNED: 'error',
  PENDING: 'warning',
}

export default function AdminUsersPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<UserStatus | ''>('')
  const [page, setPage] = useState(1)
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)

  const users = useAdminUsers({ q: q || undefined, status: status || undefined, page })
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  async function confirmBan() {
    if (!banTarget) return
    const newStatus: UserStatus = banTarget.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    try {
      await updateStatus.mutateAsync({ id: banTarget.id, status: newStatus })
      toast.success(newStatus === 'BANNED' ? 'User banned' : 'User reinstated')
      setBanTarget(null)
    } catch {
      toast.error('Action failed')
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteUser.mutateAsync(deleteTarget.id)
      toast.success('User deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Could not delete user')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Users</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="Search by name or email…"
            className="w-full h-11 pl-11 pr-4 rounded-input bg-white border border-border outline-none text-body focus:border-brand-pink"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select options={STATUS_OPTIONS} value={status} onChange={e => { setStatus(e.target.value as UserStatus | ''); setPage(1) }} />
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-left text-label font-semibold text-text-primary/60">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Listings</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border-divider">
                    <td className="px-5 py-3" colSpan={5}><Skeleton variant="text" className="h-8" /></td>
                  </tr>
                ))
              ) : (
                users.data?.data.map(u => (
                  <tr key={u.id} className="border-b border-border-divider hover:bg-background-soft">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.name} size="sm" />
                        <div>
                          <p className="text-body font-medium text-text-primary">{u.name}</p>
                          <p className="text-caption text-text-primary/50">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-body text-text-primary/60">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3 text-body text-text-primary/60">{u._count?.ads ?? 0}</td>
                    <td className="px-5 py-3"><Badge variant={statusVariant[u.status]}>{u.status.toLowerCase()}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setBanTarget(u)}
                          title={u.status === 'BANNED' ? 'Reinstate' : 'Ban'}
                          className={cn('p-2 rounded-full hover:bg-background-soft', u.status === 'BANNED' ? 'text-status-success' : 'text-status-warning')}
                        >
                          {u.status === 'BANNED' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                        </button>
                        <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-full hover:bg-background-soft text-status-error" title="Delete">
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

      {users.data && users.data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: users.data.meta.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn('w-10 h-10 rounded-button text-body font-medium', page === i + 1 ? 'bg-brand-gradient text-white' : 'border border-border')}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!banTarget}
        onOpenChange={o => !o && setBanTarget(null)}
        title={banTarget?.status === 'BANNED' ? 'Reinstate user?' : 'Ban user?'}
        description={
          banTarget?.status === 'BANNED'
            ? `${banTarget?.name} will regain access to their account.`
            : `${banTarget?.name} will be blocked from logging in and posting.`
        }
        confirmLabel={banTarget?.status === 'BANNED' ? 'Reinstate' : 'Ban user'}
        destructive={banTarget?.status !== 'BANNED'}
        loading={updateStatus.isPending}
        onConfirm={confirmBan}
      />
      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete user?"
        description={`${deleteTarget?.name} and all their data will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleteUser.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
