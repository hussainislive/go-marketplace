import { Link } from 'react-router-dom'
import { Package, CheckCircle2, Eye, MessageCircle, PlusCircle, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useDashboardStats } from '../../api/users'
import { useMyAds } from '../../api/ads'
import { useAppSelector } from '../../store/hooks'
import { AdCard } from '../../components/shared/AdCard'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

function StatCard({ icon: Icon, label, value, loading }: { icon: LucideIcon; label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-white rounded-card shadow-card p-5">
      <div className="w-11 h-11 rounded-button bg-brand-gradient/10 text-brand-pink flex items-center justify-center mb-4">
        <Icon size={22} />
      </div>
      {loading ? (
        <Skeleton variant="text" className="h-7 w-16" />
      ) : (
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      )}
      <p className="text-caption text-text-primary/55 mt-1">{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAppSelector(s => s.auth)
  const stats = useDashboardStats()
  const recent = useMyAds()

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-body text-text-primary/55 mt-0.5">Here's how your marketplace activity looks.</p>
        </div>
        <Link to="/dashboard/create">
          <Button leftIcon={<PlusCircle size={18} />}>Post an Ad</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Active Listings" value={stats.data?.activeAds ?? 0} loading={stats.isLoading} />
        <StatCard icon={CheckCircle2} label="Sold" value={stats.data?.soldAds ?? 0} loading={stats.isLoading} />
        <StatCard icon={Eye} label="Total Views" value={stats.data?.totalViews ?? 0} loading={stats.isLoading} />
        <StatCard icon={MessageCircle} label="Unread Messages" value={stats.data?.unreadMessages ?? 0} loading={stats.isLoading} />
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-card-title font-semibold text-text-primary">Your recent listings</h2>
        <Link to="/dashboard/ads" className="text-body font-medium text-brand-pink hover:text-brand-purple inline-flex items-center gap-1">
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {recent.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : recent.data && recent.data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent.data.data.slice(0, 6).map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      ) : (
        <div className="bg-white rounded-card shadow-card p-10 text-center">
          <p className="text-body text-text-primary/55">You haven't posted any listings yet.</p>
          <Link to="/dashboard/create"><Button className="mt-4">Create your first ad</Button></Link>
        </div>
      )}
    </div>
  )
}
