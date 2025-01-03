import {
	InvalidEmailError,
	InvalidNameError,
	InvalidPasswordError,
} from '@/core/errors'
import { DuplicatedResourceError } from '@/core/errors/duplicated-resource-error'
import { makeAccount } from '@/tests/factories/make-account'
import { InMemoryAccountRepository } from '@/tests/repositories/in-memory-account-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { AccountRepository } from '../repositories/account-repository'
import { CreateAccountUseCase } from './create-account'

describe('Create Account Use Case:', () => {
	let accountRepository: AccountRepository
	let sut: CreateAccountUseCase

	beforeEach(() => {
		accountRepository = new InMemoryAccountRepository()
		sut = new CreateAccountUseCase(accountRepository)
	})

	it('should create an account', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'Test123!',
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { account } = result.value
			expect(account.id).toBeDefined()
		}
	})

	it('should throw an error if the account already exists', async () => {
		const testAccount = makeAccount()
		accountRepository.create(testAccount)

		const result = await sut.execute({
			email: testAccount.email,
			name: testAccount.name,
			password: testAccount.password,
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(DuplicatedResourceError)
		}
	})

	it('should throw an error if the email is invalid', async () => {
		const result = await sut.execute({
			email: 'invalid_email',
			name: 'Test User',
			password: 'Test123!',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidEmailError)
		}
	})

	it('should throw an error if the name is invalid', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'T',
			password: 'Test123!',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidNameError)
		}
	})

	it('should throw an error if the password is too short', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'Test',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password is too long', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'Test!123456789012',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password does not contain a number', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'TestTestTest!',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password does not contain an uppercase letter', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'test!123',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password does not contain a lowercase letter', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'TEST!123',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password does not contain a special character', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'Test123',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})

	it('should throw an error if the password contains spaces or tabs', async () => {
		const result = await sut.execute({
			email: 'test@example.com',
			name: 'Test User',
			password: 'Test! 123',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(InvalidPasswordError)
		}
	})
})
