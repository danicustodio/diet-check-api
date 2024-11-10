import { type Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { Email } from '../../enterprise/entities/value-objects/email'
import { Password } from '../../enterprise/entities/value-objects/password'
import type { EntityError } from '../../enterprise/errors/entity-error'
import type { HashingService } from '../../enterprise/services/hashing-service'
import type { UserRepository } from '../repositories/user-repository'

interface RegisterUserRequest {
	name: string
	email: string
	password: string
}

type RegisterUserResponse = Either<EntityError, { user: User }>

export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hashingService: HashingService
	) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUserRequest): Promise<RegisterUserResponse> {
		const emailResult = Email.create(email)
		if (emailResult.isLeft()) {
			return left(emailResult.value)
		}

		const passwordResult = Password.create(password, this.hashingService)
		if (passwordResult.isLeft()) {
			return left(passwordResult.value)
		}

		const result = User.create({
			name,
			email: emailResult.value,
			password: passwordResult.value,
			token: null,
		})

		if (result.isLeft()) {
			return left(result.value)
		}

		const user = result.value
		await this.userRepository.create(user)

		return right({ user })
	}
}
