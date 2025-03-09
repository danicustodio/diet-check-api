import type { Account } from '@/domain/account/entities/account'
import type { AccountRepository } from '@/domain/account/repositories/account-repository'
import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
// biome-ignore lint/style/useImportType: <explanation>
import { DrizzleService } from '../drizzle.service'
import { drizzleAccountMapper } from '../mappers/drizzleAccountMapper'
import { schema } from '../schemas'

@Injectable()
export class DrizzleAccountRepository implements AccountRepository {
  constructor(private drizzle: DrizzleService) {}

  async create({ name, email, password }: Account): Promise<void> {
    try {
      const db = this.drizzle.getDb()
      await db.insert(schema.accounts).values({
        name,
        email,
        password,
      })
    } catch (error) {
      const typedError = error as Error
      throw new Error(`Failed to create account: ${typedError.message}`)
    }
  }

  async findByEmail(email: string) {
    try {
      const db = this.drizzle.getDb()
      const account = await db
        .select()
        .from(schema.accounts)
        .where(eq(schema.accounts.email, email))

      return account.length > 0
        ? drizzleAccountMapper.toDomain(account[0])
        : null
    } catch (error) {
      const typedError = error as Error
      throw new Error(`Failed to find account by email: ${typedError.message}`)
    }
  }
}
