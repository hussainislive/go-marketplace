import { useRef } from 'react'
import { Camera, MapPin, Calendar, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMe, useUpdateAvatar, useUserAds } from '../../api/users'
import { useAppSelector } from '../../store/hooks'
import { Avatar } from '../../components/ui/Avatar'
import { VerifiedBadge } from '../../components/shared/VerifiedBadge'
import { AdCard } from '../../components/shared/AdCard'
import { AdGridSkeleton } from '../../components/shared/AdCardSkeleton'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDate } from '../../utils/format'

export default function ProfilePage() {
  const authUser = useAppSelector(s => s.auth.user)
  const me = useMe()
  const myAds = useUserAds(authUser?.id)
  const updateAvatar = useUpdateAvatar()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await updateAvatar.mutateAsync(file)
      toast.success('Avatar updated')
    } catch {
      toast.error('Could not update avatar')
    }
  }

  const profile = me.data

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover + avatar */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="h-36 bg-brand-gradient relative" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="relative">
              {me.isLoading ? (
                <Skeleton variant="avatar" className="w-24 h-24 border-4 border-white" />
              ) : (
                <div className="rounded-full border-4 border-white">
                  <Avatar src={profile?.avatar} name={profile?.name ?? 'U'} size="xl" />
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-card"
              >
                <Camera size={15} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-card-title font-bold text-text-primary">{profile?.name ?? 'Loading…'}</h1>
                {profile?.isVerified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-4 text-caption text-text-primary/55 mt-1">
                {profile?.city && <span className="flex items-center gap-1"><MapPin size={13} /> {profile.city}</span>}
                {profile?.createdAt && <span className="flex items-center gap-1"><Calendar size={13} /> Joined {formatDate(profile.createdAt)}</span>}
                <span className="flex items-center gap-1"><Package size={13} /> {profile?._count?.ads ?? 0} listings</span>
              </div>
            </div>
          </div>
          {profile?.bio && <p className="text-body text-text-primary/70 mt-4">{profile.bio}</p>}
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-card-title font-semibold text-text-primary mt-8 mb-5">Active Listings</h2>
      {myAds.isLoading ? (
        <AdGridSkeleton count={4} />
      ) : myAds.data && myAds.data.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myAds.data.data.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      ) : (
        <p className="text-body text-text-primary/50">No active listings.</p>
      )}
    </div>
  )
}
