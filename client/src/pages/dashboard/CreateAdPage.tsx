import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Check, ChevronLeft, ChevronRight, Upload, X, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCategories } from '../../api/categories'
import { useCreateAd } from '../../api/ads'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { formatPrice, cn, apiErrorMessage } from '../../utils/format'
import type { Condition } from '../../types'

interface AdDraft {
  categoryId: string
  title: string
  description: string
  price: string
  condition: Condition
  negotiable: boolean
  city: string
}

const STEPS = ['Category', 'Details', 'Photos', 'Location', 'Review']
const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
]

export default function CreateAdPage() {
  const navigate = useNavigate()
  const categories = useCategories()
  const createAd = useCreateAd()

  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [draft, setDraft] = useState<AdDraft>({
    categoryId: '',
    title: '',
    description: '',
    price: '',
    condition: 'USED',
    negotiable: false,
    city: '',
  })

  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => [...prev, ...accepted].slice(0, 10))
    setPreviews(prev => [...prev, ...accepted.map(f => URL.createObjectURL(f))].slice(0, 10))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024,
  })

  function removeImage(i: number) {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  function set<K extends keyof AdDraft>(key: K, value: AdDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return !!draft.categoryId
      case 1: return draft.title.length >= 3 && draft.description.length >= 10 && /^\d+(\.\d{1,2})?$/.test(draft.price)
      case 2: return files.length > 0
      case 3: return draft.city.length >= 2
      default: return true
    }
  }

  async function publish() {
    try {
      const fd = new FormData()
      fd.append('title', draft.title)
      fd.append('description', draft.description)
      fd.append('price', draft.price)
      fd.append('condition', draft.condition)
      fd.append('negotiable', String(draft.negotiable))
      fd.append('city', draft.city)
      fd.append('categoryId', draft.categoryId)
      files.forEach(f => fd.append('images', f))
      const ad = await createAd.mutateAsync(fd)
      toast.success('Listing published!')
      navigate(`/ads/${ad.id}`)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not publish your listing.'))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Post a New Ad</h1>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <span key={label} className={cn('text-caption font-medium', i <= step ? 'text-brand-pink' : 'text-text-primary/40')}>
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-gradient transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-6">
        {/* Step 0: Category */}
        {step === 0 && (
          <div>
            <h2 className="text-card-title font-semibold mb-4">Choose a category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.data?.map(c => (
                <button
                  key={c.id}
                  onClick={() => set('categoryId', c.id)}
                  className={cn(
                    'p-4 rounded-button border text-body font-medium transition-all',
                    draft.categoryId === c.id ? 'border-brand-pink bg-brand-pink/5 text-brand-pink' : 'border-border hover:border-brand-pink/50'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-card-title font-semibold">Listing details</h2>
            <Input label="Title" placeholder="e.g. iPhone 14 Pro Max 256GB" value={draft.title} onChange={e => set('title', e.target.value)} />
            <div>
              <label className="block text-label font-semibold text-text-primary mb-1.5">Description</label>
              <textarea
                value={draft.description}
                onChange={e => set('description', e.target.value)}
                rows={5}
                placeholder="Describe your item — condition, features, reason for selling..."
                className="w-full p-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (USD)" type="number" placeholder="0" value={draft.price} onChange={e => set('price', e.target.value)} />
              <Select label="Condition" options={CONDITIONS} value={draft.condition} onChange={e => set('condition', e.target.value as Condition)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.negotiable} onChange={e => set('negotiable', e.target.checked)} className="w-4 h-4 accent-brand-pink" />
              <span className="text-body text-text-primary/75">Price is negotiable</span>
            </label>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div>
            <h2 className="text-card-title font-semibold mb-4">Add photos <span className="text-caption text-text-primary/50 font-normal">(up to 10)</span></h2>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-brand-pink bg-brand-pink/5' : 'border-border hover:border-brand-pink/50'
              )}
            >
              <input {...getInputProps()} />
              <Upload size={32} className="mx-auto text-text-primary/40 mb-3" />
              <p className="text-body font-medium text-text-primary">Drag & drop images here</p>
              <p className="text-caption text-text-primary/50 mt-1">or click to browse · max 10MB each</p>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-brand-gradient text-white px-1.5 py-0.5 rounded">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-card-title font-semibold">Where is it located?</h2>
            <Input label="City" leftIcon={<MapPin size={18} />} placeholder="e.g. Dubai" value={draft.city} onChange={e => set('city', e.target.value)} />
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-card-title font-semibold mb-4">Review & publish</h2>
            <div className="flex gap-4">
              {previews[0] && <img src={previews[0]} alt="" className="w-28 h-28 rounded-lg object-cover" />}
              <div className="flex-1">
                <p className="text-card-title font-bold text-brand-gradient">{formatPrice(draft.price || '0')}</p>
                <p className="text-body font-semibold text-text-primary mt-1">{draft.title}</p>
                <p className="text-caption text-text-primary/55 mt-1 line-clamp-2">{draft.description}</p>
                <div className="flex gap-2 text-caption text-text-primary/50 mt-2">
                  <span>{draft.city}</span><span>·</span><span className="capitalize">{draft.condition.toLowerCase()}</span>
                  {draft.negotiable && <><span>·</span><span>Negotiable</span></>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" leftIcon={<ChevronLeft size={18} />} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button rightIcon={<ChevronRight size={18} />} disabled={!canAdvance()} onClick={() => setStep(s => s + 1)}>
              Next
            </Button>
          ) : (
            <Button leftIcon={<Check size={18} />} loading={createAd.isPending} onClick={publish}>
              Publish Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
