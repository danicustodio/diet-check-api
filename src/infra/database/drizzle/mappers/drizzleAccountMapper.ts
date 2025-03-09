import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account } from '@/domain/account/entities/account'
import { Email } from '@/domain/account/entities/value-objects/email'
import type { DrizzleAccount } from '../schemas/accounts'

export const drizzleAccountMapper = {
  toDomain(raw: DrizzleAccount): Account {
    return Account.create(
      {
        name: raw.name,
        email: new Email(raw.email),
        password: raw.password,
      },
      new UniqueEntityID(raw.id)
    )
  },
}
