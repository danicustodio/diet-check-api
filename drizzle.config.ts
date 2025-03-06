import type { Config } from 'drizzle-kit'

export default {
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql',
  schema: 'src/infra/database/drizzle/schemas/*',
  out: 'src/infra/database/drizzle/migrations',
} satisfies Config
