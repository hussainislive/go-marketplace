import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success } from '../utils/ApiResponse'
import * as categoryService from '../services/category.service'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories()
  res.json(success('Categories retrieved', categories))
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, icon, slug } = req.body as { name: string; icon: string; slug: string }
  const category = await categoryService.createCategory(name, icon, slug)
  res.status(201).json(success('Category created', category))
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, icon } = req.body as { name?: string; icon?: string }
  const category = await categoryService.updateCategory(param(req, 'id'), { name, icon })
  res.json(success('Category updated', category))
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(param(req, 'id'))
  res.json(success('Category deleted'))
})
