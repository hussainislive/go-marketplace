import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, X, MapPin, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAd, useUpdateAd } from '../../api/ads'
import { useCategories } from '../../api/categories'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { cn, apiErrorMessage } from '../../utils/format'
import type { Condition } from '../../types'

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
]

export default function EditAdPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ad, isLoading } = useAd(id)
  const categories = useCategories()
  const updateAd = useUpdateAd(id ?? '')

  const [form, setForm] = useState({
    title: '', description: '', price: '', condition: 'USED' as Condition, negotiable: false, city: '', categoryId: '',
  })
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    if (ad) {
      setForm({
        title: ad.title,
        description: ad.description,
        price: String(ad.price),
        condition: ad.condition,
        negotiable: ad.negotiable,
        city: ad.city,
        categoryId: ad.categoryId,
      })
    }
  }, [ad])

  const onDrop = useCallback((accepted: File[]) => {
    setNewFiles(prev => [...prev, ...accepted].slice(0, 10))
    setNewPreviews(prev => [...prev, ...accepted.map(f => URL.createObjectURL(f))].slice(0, 10))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 10,
  })

  async function save() {
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('price', form.price)
      fd.append('condition', form.condition)
      fd.append('negotiable', String(form.negotiable))
      fd.append('city', form.city)
      fd.append('categoryId', form.categoryId)
      newFiles.forEach(f => fd.append('images', f))
      await updateAd.mutateAsync(fd)
      toast.success('Listing updated')
      navigate('/dashboard/ads')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not update listing'))
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="rect" className="h-96 rounded-card" />
      </div>
    )
  }

  if (!ad) {
    return <div className="text-center py-20 text-body text-text-primary/55">Listing not found.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Listing</h1>
      <div className="bg-white rounded-card shadow-card p-6 space-y-4">
        <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <div>
          <label className="block text-label font-semibold text-text-primary mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={5}
            className="w-full p-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (USD)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          <Select label="Condition" options={CONDITIONS} value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as Condition }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="City" leftIcon={<MapPin size={18} />} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          <Select
            label="Category"
            options={categories.data?.map(c => ({ value: c.id, label: c.name })) ?? []}
            value={form.categoryId}
            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.negotiable} onChange={e => setForm(f => ({ ...f, negotiable: e.target.checked }))} className="w-4 h-4 accent-brand-pink" />
          <span className="text-body text-text-primary/75">Price is negotiable</span>
        </label>

        {/* Existing images */}
        <div>
          <label className="block text-label font-semibold text-text-primary mb-2">Current photos</label>
          <div className="grid grid-cols-4 gap-2">
            {ad.images.map((img, i) => (
              <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover opacity-90" />
            ))}
          </div>
          <p className="text-caption text-text-primary/50 mt-2">Uploading new photos replaces the current set.</p>
        </div>

        {/* New images */}
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-brand-pink bg-brand-pink/5' : 'border-border hover:border-brand-pink/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto text-text-primary/40 mb-2" />
          <p className="text-body text-text-primary/70">Add new photos</p>
        </div>
        {newPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {newPreviews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setNewFiles(p => p.filter((_, idx) => idx !== i)); setNewPreviews(p => p.filter((_, idx) => idx !== i)) }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard/ads')}>Cancel</Button>
          <Button leftIcon={<Save size={18} />} loading={updateAd.isPending} onClick={save}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}
