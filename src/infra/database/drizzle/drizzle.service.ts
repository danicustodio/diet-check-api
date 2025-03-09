// biome-ignore lint/style/useImportType: <explanation>
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from './schemas'

@Injectable()
export class DrizzleService {
  private db: PostgresJsDatabase<typeof schema>

  constructor(config: EnvService) {
    const connectionString = config.get('DATABASE_URL')
    const queryClient = postgres(connectionString)
    this.db = drizzle(queryClient, { schema })
  }

  getDb(): PostgresJsDatabase<typeof schema> {
    return this.db
  }
}
