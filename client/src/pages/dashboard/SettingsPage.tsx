import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useMe, useUpdateProfile } from '../../api/users'
import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../store/authSlice'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function SettingsPage() {
  const me = useMe()
  const updateProfile = useUpdateProfile()
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({ name: '', phone: '', city: '', bio: '' })
  const [notifPrefs, setNotifPrefs] = useState({ messages: true, favorites: true, updates: true })

  useEffect(() => {
    if (me.data) {
      setForm({
        name: me.data.name ?? '',
        phone: me.data.phone ?? '',
        city: me.data.city ?? '',
        bio: me.data.bio ?? '',
      })
    }
  }, [me.data])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      const updated = await updateProfile.mutateAsync(form)
      dispatch(setUser(updated))
      toast.success('Profile saved')
    } catch {
      toast.error('Could not save profile')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Settings</h1>

      {/* Profile */}
      <section className="bg-white rounded-card shadow-card p-6 mb-6">
        <h2 className="text-card-title font-semibold mb-5">Profile information</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <Input label="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
            <Input label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Dubai" />
          </div>
          <div>
            <label className="block text-label font-semibold text-text-primary mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell buyers a bit about yourself…"
              className="w-full p-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={updateProfile.isPending}>Save changes</Button>
          </div>
        </form>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-card shadow-card p-6 mb-6">
        <h2 className="text-card-title font-semibold mb-5">Notification preferences</h2>
        <div className="space-y-4">
          {([
            ['messages', 'New messages', 'Get notified when someone messages you'],
            ['favorites', 'Favorites', 'When someone saves your listing'],
            ['updates', 'Listing updates', 'Status changes on your listings'],
          ] as const).map(([key, label, desc]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-body font-medium text-text-primary">{label}</p>
                <p className="text-caption text-text-primary/50">{desc}</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifPrefs[key] ? 'bg-brand-pink' : 'bg-border'}`}
                onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${notifPrefs[key] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-card-title font-semibold mb-2">Privacy & account</h2>
        <p className="text-body text-text-primary/55 mb-4">Manage your account security and data.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Change password</Button>
          <Button variant="danger">Delete account</Button>
        </div>
      </section>
    </div>
  )
}
