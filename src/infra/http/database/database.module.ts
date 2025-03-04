import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { InMemoryAccountRepository } from '@/tests/repositories/in-memory-account-repository'
import { Module } from '@nestjs/common'

@Module({
  controllers: [],
  providers: [
    { provide: AccountRepository, useClass: InMemoryAccountRepository },
  ],
  exports: [AccountRepository],
})
export class DatabaseModule {}
