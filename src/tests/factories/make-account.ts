import { Account } from '@/domain/account/entities/account'
import type { AccountProps } from '@/domain/account/entities/account'
import { Email } from '@/domain/account/entities/value-objects/email'
import { Password } from '@/domain/account/entities/value-objects/password'
import { faker } from '@faker-js/faker'

export function makeAccount(overrides: Partial<AccountProps> = {}): Account {
	return Account.create({
		email: new Email(faker.internet.email()),
		name: faker.person.fullName(),
		password: new Password('@Password123!'),
		...overrides,
	})
}
