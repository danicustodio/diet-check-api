import { type Either, left, right } from '@/core/either'
import { InvalidEmailError } from '../../errors/invalid-email-error'

export class Email {
	constructor(private readonly _value: string) {}

	get value() {
		return this._value
	}

	public static create(email: string): Either<InvalidEmailError, Email> {
		if (!Email.isValid(email)) {
			return left(new InvalidEmailError(email))
		}

		return right(new Email(email))
	}

	public static isValid(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}
}
