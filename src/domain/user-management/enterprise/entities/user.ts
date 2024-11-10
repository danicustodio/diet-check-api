import { type Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InvalidNameError } from '../errors/invalid-name-error'
import type { Email } from './value-objects/email'
import type { Password } from './value-objects/password'

export interface UserProps {
	name: string
	email: Email
	password: Password
	token: string | null
}

export class User extends Entity<UserProps> {
	get name() {
		return this.props.name
	}
	get email() {
		return this.props.email.value
	}
	get password() {
		return this.props.password
	}
	get token() {
		return this.props.token
	}

	static create(
		props: UserProps,
		id?: UniqueEntityID
	): Either<InvalidNameError, User> {
		if (props.name.length < 3) {
			return left(new InvalidNameError(props.name))
		}

		const user = new User(props, id)

		return right(user)
	}
}
