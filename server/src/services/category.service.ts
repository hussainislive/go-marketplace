import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { ads: true } } },
  })
}

export async function createCategory(name: string, icon: string, slug: string) {
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) throw ApiError.conflict('Category with this slug already exists')
  return prisma.category.create({ data: { name, icon, slug } })
}

export async function updateCategory(id: string, data: { name?: string; icon?: string }) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw ApiError.notFound('Category not found')
  return prisma.category.update({ where: { id }, data })
}

export async function deleteCategory(id: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { ads: true } } },
  })
  if (!category) throw ApiError.notFound('Category not found')
  if (category._count.ads > 0) {
    throw ApiError.badRequest('Cannot delete category with existing ads')
  }
  await prisma.category.delete({ where: { id } })
}
