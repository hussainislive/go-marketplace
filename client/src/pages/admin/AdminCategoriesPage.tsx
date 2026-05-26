import { useState } from 'react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../api/categories'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import type { Category } from '../../types'

function resolveIcon(name: string): LucideIcon {
  const lib = Icons as unknown as Record<string, LucideIcon>
  return lib[name] ?? Icons.Tag
}

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminCategoriesPage() {
  const categories = useCategories()
  const createCat = useCreateCategory()
  const updateCat = useUpdateCategory()
  const deleteCat = useDeleteCategory()

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', icon: '' })
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', icon: 'Tag' })
    setEditOpen(true)
  }
  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, icon: c.icon })
    setEditOpen(true)
  }

  async function save() {
    try {
      if (editing) {
        await updateCat.mutateAsync({ id: editing.id, name: form.name, icon: form.icon, slug: editing.slug })
        toast.success('Category updated')
      } else {
        await createCat.mutateAsync({ name: form.name, icon: form.icon, slug: slugify(form.name) })
        toast.success('Category created')
      }
      setEditOpen(false)
    } catch {
      toast.error('Action failed')
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteCat.mutateAsync(deleteTarget.id)
      toast.success('Category deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Could not delete — it may still have listings.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
        <Button leftIcon={<Plus size={18} />} onClick={openCreate}>Add Category</Button>
      </div>

      {categories.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="card" className="h-32" />)}
        </div>
      ) : categories.data && categories.data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.data.map(c => {
            const Icon = resolveIcon(c.icon)
            return (
              <div key={c.id} className="bg-white rounded-card shadow-card p-5 flex flex-col items-center text-center relative group">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-full hover:bg-background-soft text-text-primary/60"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-full hover:bg-background-soft text-status-error"><Trash2 size={15} /></button>
                </div>
                <div className="w-14 h-14 rounded-card bg-brand-gradient text-white flex items-center justify-center mb-3">
                  <Icon size={24} />
                </div>
                <p className="text-body font-semibold text-text-primary">{c.name}</p>
                <p className="text-caption text-text-primary/50">{c._count?.ads ?? 0} listings</p>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={FolderTree} title="No categories" description="Create your first category." ctaLabel="Add Category" onCta={openCreate} />
      )}

      {/* Create / edit modal */}
      <Modal open={editOpen} onOpenChange={setEditOpen} title={editing ? 'Edit category' : 'New category'} className="sm:max-w-md">
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Electronics" />
          <Input
            label="Icon (Lucide name)"
            value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            placeholder="e.g. Laptop, Car, Home"
            helperText="Use any Lucide icon name (PascalCase)."
          />
          <Button fullWidth loading={createCat.isPending || updateCat.isPending} onClick={save} disabled={form.name.length < 2}>
            {editing ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete category?"
        description={`"${deleteTarget?.name}" will be removed. Categories with existing listings cannot be deleted.`}
        confirmLabel="Delete"
        destructive
        loading={deleteCat.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
