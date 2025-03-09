import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { DrizzleService } from './drizzle/drizzle.service'
import { DrizzleAccountRepository } from './drizzle/repositories/drizzle-account-repository'

@Module({
  imports: [EnvModule],
  providers: [
    DrizzleService,
    { provide: AccountRepository, useClass: DrizzleAccountRepository },
  ],
  exports: [DrizzleService, AccountRepository],
})
export class DatabaseModule {}
