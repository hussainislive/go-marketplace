import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as reportService from '../services/report.service'
import type { CreateReportInput } from '../validators/report.validator'

type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { adId, reason, description } = req.body as CreateReportInput
  const report = await reportService.createReport(req.user!.id, adId, reason, description)
  res.status(201).json(success('Report submitted', report))
})

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const status = req.query.status as ReportStatus | undefined
  const { reports, total } = await reportService.getReports({ status, page, limit })
  res.json(paginated('Reports retrieved', reports, total, page, limit))
})

export const updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: ReportStatus }
  const report = await reportService.updateReportStatus(param(req, 'id'), status)
  res.json(success('Report status updated', report))
})
