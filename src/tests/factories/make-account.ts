import { Account, type AccountProps } from '@/domain/account/entities/account'
import { Email } from '@/domain/account/entities/value-objects/email'
import { faker } from '@faker-js/faker'

export function makeAccount(overrides: Partial<AccountProps> = {}): Account {
  return Account.create({
    email: new Email(faker.internet.email()),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    ...overrides,
  })
}
