import { InMemoryUserRepository } from '@/tests/repositories/in-memory-user-repository'
import { MockHashingService } from '@/tests/services/mock-hashing-service'
import { beforeEach, describe, expect, it } from 'vitest'
import {
	InvalidEmailError,
	InvalidNameError,
	InvalidPasswordError,
} from '../../enterprise/errors'
import type { HashingService } from '../../enterprise/services/hashing-service'
import type { UserRepository } from '../repositories/user-repository'
import { RegisterUserUseCase } from './register-user'

describe('Register User Use Case', () => {
	let userRepository: UserRepository
	let hashingService: HashingService
	let sut: RegisterUserUseCase

	beforeEach(() => {
		userRepository = new InMemoryUserRepository()
		hashingService = new MockHashingService()
		sut = new RegisterUserUseCase(userRepository, hashingService)
	})

	it('should register a user', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '@Password123',
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.user.id).toBeDefined()
		}
	})
	it('should return an error if the e-mail is invalid', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'john@example',
			password: '@Password123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidEmailError)
	})
	it('should return an error if the password is invalid', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'password',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidPasswordError)
	})
	it('should return an error if the name is invalid', async () => {
		const result = await sut.execute({
			name: 'J',
			email: 'john@example.com',
			password: '@Password123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidNameError)
	})
})
