import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'

type ReportReason = 'SPAM' | 'FRAUD' | 'INAPPROPRIATE' | 'FAKE_LISTING' | 'HARASSMENT' | 'OTHER'
type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'

export async function createReport(
  reportedById: string,
  adId: string,
  reason: ReportReason,
  description: string | undefined
) {
  const ad = await prisma.ad.findUnique({ where: { id: adId } })
  if (!ad) throw ApiError.notFound('Ad not found')
  if (ad.userId === reportedById) throw ApiError.badRequest('Cannot report your own ad')

  const existing = await prisma.report.findFirst({ where: { reportedById, adId } })
  if (existing) throw ApiError.conflict('You have already reported this ad')

  return prisma.report.create({
    data: { reportedById, adId, reason, description },
  })
}

export async function getReports(
  filters: { status?: ReportStatus; page: number; limit: number }
) {
  const { status, page, limit } = filters
  const skip = (page - 1) * limit
  const where = status ? { status } : {}

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reportedBy: { select: { id: true, name: true, email: true, avatar: true } },
        ad: { select: { id: true, title: true, images: true, userId: true } },
      },
    }),
    prisma.report.count({ where }),
  ])

  return { reports, total }
}

export async function updateReportStatus(id: string, status: ReportStatus) {
  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) throw ApiError.notFound('Report not found')

  return prisma.report.update({
    where: { id },
    data: { status },
    include: {
      reportedBy: { select: { id: true, name: true, email: true } },
      ad: { select: { id: true, title: true } },
    },
  })
}
