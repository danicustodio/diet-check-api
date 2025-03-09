import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { Module } from '@nestjs/common'
import { InMemoryAccountRepository } from './repositories/in-memory-account-repository'

@Module({
  providers: [
    { provide: AccountRepository, useClass: InMemoryAccountRepository },
  ],
  exports: [AccountRepository],
})
export class MockDatabaseModule {}
