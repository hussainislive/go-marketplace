import path from 'node:path'
import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  migrations: {
    seed: 'ts-node -P tsconfig.seed.json prisma/seed.ts',
  },
  adapter: () => {
    const pool = new Pool({ connectionString: process.env.DIRECT_URL })
    return new PrismaPg(pool)
  },
})
