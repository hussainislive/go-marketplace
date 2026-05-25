import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter, log: ['warn', 'error'] })
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const prisma = (global.__prisma as PrismaClient | undefined) ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

export default prisma
