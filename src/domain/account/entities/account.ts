import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
	InvalidEmailError,
	InvalidNameError,
	InvalidPasswordError,
} from '@/core/errors'
import { Email } from './value-objects/email'
import { Password } from './value-objects/password'

export interface AccountProps {
	email: Email
	name: string
	password: Password
}

export class Account extends Entity<AccountProps> {
	get email() {
		return this.props.email.email
	}

	get name() {
		return this.props.name
	}

	get password() {
		return this.props.password.password
	}

	static create(props: AccountProps, id?: UniqueEntityID): Account {
		const { email, name, password } = props

		if (name.length < 3) {
			throw new InvalidNameError(name)
		}

		if (!Email.isValid(email.email)) {
			throw new InvalidEmailError(email.email)
		}

		if (!Password.isValid(password.password)) {
			throw new InvalidPasswordError(password.password)
		}

		return new Account(props, id)
	}
}
