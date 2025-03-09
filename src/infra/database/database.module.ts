import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { Module } from '@nestjs/common'
import { DrizzleService } from './drizzle/drizzle.service'
import { DrizzleAccountRepository } from './drizzle/repositories/drizzle-account-repository'

@Module({
  providers: [
    DrizzleService,
    { provide: AccountRepository, useClass: DrizzleAccountRepository },
  ],
  exports: [DrizzleService, AccountRepository],
})
export class DatabaseModule {}
