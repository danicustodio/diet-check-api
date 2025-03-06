import { Account, type AccountProps } from '@/domain/account/entities/account'
import { Email } from '@/domain/account/entities/value-objects/email'
// biome-ignore lint/style/useImportType: <explanation>
import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAccount(overrides: Partial<AccountProps> = {}): Account {
  return Account.create({
    email: new Email(faker.internet.email()),
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 8, prefix: '@Te1' }),
    ...overrides,
  })
}

@Injectable()
export class AccountInMemoryFactory {
  constructor(private repository: AccountRepository) {}

  async makeAccount(data: Partial<AccountProps> = {}): Promise<Account> {
    const account = makeAccount(data)

    await this.repository.create(account)

    return account
  }
}
