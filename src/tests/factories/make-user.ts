import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
	User,
	type UserProps,
} from '@/domain/user-management/enterprise/entities/user'
import { Email } from '@/domain/user-management/enterprise/entities/value-objects/email'
import { Password } from '@/domain/user-management/enterprise/entities/value-objects/password'
import { faker } from '@faker-js/faker'
import { MockHashingService } from '../services/mock-hashing-service'

export function makeUser(
	overrides: Partial<UserProps> = {},
	id?: UniqueEntityID
): User {
	const email = Email.create(faker.internet.email())
	if (email.isLeft()) {
		throw email.value
	}

	const hashingService = new MockHashingService()
	const password = Password.create(faker.internet.password(), hashingService)
	if (password.isLeft()) {
		throw password.value
	}

	const user = User.create(
		{
			name: faker.person.fullName(),
			email: email.value,
			password: password.value,
			token: null,
			...overrides,
		},
		id
	)

	if (user.isLeft()) {
		throw user.value
	}

	return user.value
}
