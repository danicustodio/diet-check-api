import { Injectable } from '@nestjs/common'
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from './schemas'

@Injectable()
export class DrizzleService {
  private db: PostgresJsDatabase<typeof schema>

  constructor() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    const queryClient = postgres(connectionString)
    this.db = drizzle(queryClient, { schema })
  }

  getDb(): PostgresJsDatabase<typeof schema> {
    return this.db
  }
}
