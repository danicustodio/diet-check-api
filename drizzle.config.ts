import { envSchema } from '@/infra/env/env'
import type { Config } from 'drizzle-kit'

const config = envSchema.parse(process.env)

export default {
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: 'src/infra/database/drizzle/schemas/*',
  out: 'src/infra/database/drizzle/migrations',
} satisfies Config
