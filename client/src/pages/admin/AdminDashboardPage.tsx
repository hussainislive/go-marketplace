import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Users, Package, CheckCircle2, Flag, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAdminStats } from '../../api/admin'
import { Skeleton } from '../../components/ui/Skeleton'
import { format } from 'date-fns'

function StatCard({ icon: Icon, label, value, loading }: { icon: LucideIcon; label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-white rounded-card shadow-card p-5">
      <div className="w-11 h-11 rounded-button bg-brand-gradient text-white flex items-center justify-center mb-4">
        <Icon size={22} />
      </div>
      {loading ? <Skeleton variant="text" className="h-7 w-16" /> : <p className="text-2xl font-bold text-text-primary">{value}</p>}
      <p className="text-caption text-text-primary/55 mt-1">{label}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const stats = useAdminStats()

  // Aggregate recentUsers (grouped by exact timestamp) into per-day counts
  const usersByDay = (() => {
    const map = new Map<string, number>()
    for (const r of stats.data?.recentUsers ?? []) {
      const day = format(new Date(r.createdAt), 'MMM d')
      map.set(day, (map.get(day) ?? 0) + r._count.id)
    }
    return Array.from(map.entries()).map(([day, count]) => ({ day, count }))
  })()

  const adsByCategory = (stats.data?.adsByCategory ?? []).map(c => ({ name: c.name, ads: c._count.ads }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value={stats.data?.totalUsers ?? 0} loading={stats.isLoading} />
        <StatCard icon={Package} label="Total Ads" value={stats.data?.totalAds ?? 0} loading={stats.isLoading} />
        <StatCard icon={CheckCircle2} label="Active Ads" value={stats.data?.activeAds ?? 0} loading={stats.isLoading} />
        <StatCard icon={Flag} label="Pending Reports" value={stats.data?.pendingReports ?? 0} loading={stats.isLoading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-card-title font-semibold mb-4">New users (last 7 days)</h2>
          {stats.isLoading ? (
            <Skeleton variant="rect" className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={usersByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#232323' }} />
                <YAxis tick={{ fontSize: 12, fill: '#232323' }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#C82C8C" strokeWidth={2.5} dot={{ fill: '#8A1D9D' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-card-title font-semibold mb-4">Ads by category</h2>
          {stats.isLoading ? (
            <Skeleton variant="rect" className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={adsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#232323' }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 12, fill: '#232323' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="ads" fill="#C82C8C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-card-title font-semibold">Moderation queue</h2>
          <p className="text-body text-text-primary/55 mt-1">
            {stats.data?.pendingReports ?? 0} report{(stats.data?.pendingReports ?? 0) === 1 ? '' : 's'} awaiting review
          </p>
        </div>
        <Link to="/admin/reports" className="inline-flex items-center gap-1 text-body font-medium text-brand-pink hover:text-brand-purple">
          Review now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
