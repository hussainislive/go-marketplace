import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Category } from '../../types'

function resolveIcon(name: string): LucideIcon {
  const lib = Icons as unknown as Record<string, LucideIcon>
  return lib[name] ?? Icons.Tag
}

export function CategoryCard({ category }: { category: Category }) {
  const Icon = resolveIcon(category.icon)
  return (
    <Link to={`/search?category=${category.slug}`} className="group flex flex-col items-center gap-3 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-card bg-white shadow-card flex items-center justify-center text-text-primary/70 transition-all duration-200 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-card-hover group-hover:scale-105">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-body font-medium text-text-primary leading-tight">{category.name}</p>
        {typeof category._count?.ads === 'number' && (
          <p className="text-caption text-text-primary/45">{category._count.ads} ads</p>
        )}
      </div>
    </Link>
  )
}
