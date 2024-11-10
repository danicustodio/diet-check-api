import { type Either, left, right } from '@/core/either'
import { InvalidPasswordError } from '../../errors/invalid-password-error'
import type { HashingService } from '../../services/hashing-service'

export class Password {
	private constructor(
		private readonly _hashedPassword: string,
		private readonly _hashingService: HashingService
	) {}

	get hashedPassword() {
		return this._hashedPassword
	}

	public static create(
		password: string,
		hashingService: HashingService
	): Either<InvalidPasswordError, Password> {
		if (!Password.isValid(password)) {
			return left(new InvalidPasswordError(password))
		}

		const hashedPassword = hashingService.hash(password)

		return right(new Password(hashedPassword, hashingService))
	}

	public static isValid(password: string): boolean {
		/*
      - Minimum 8 characters
      - Maximum 16 characters
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one number
      - At least one special character
      - No spaces or tabs
    */
		const passwordRegex =
			/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/

		return passwordRegex.test(password)
	}

	public compare(plainPassword: string): boolean {
		return this._hashingService.compare(plainPassword, this._hashedPassword)
	}
}
