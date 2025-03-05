import { isLeft, isRight, unwrapEither } from '@/core/either'
import { InvalidEmailError, InvalidNameError } from '@/core/errors'
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

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { account } = unwrapEither(result)
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

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(DuplicatedResourceError)
    }
  })

  it('should throw an error if the email is invalid', async () => {
    const result = await sut.execute({
      email: 'invalid_email',
      name: 'Test User',
      password: 'Test123!',
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(InvalidEmailError)
    }
  })

  it('should throw an error if the name is invalid', async () => {
    const result = await sut.execute({
      email: 'test@example.com',
      name: 'T',
      password: 'Test123!',
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(InvalidNameError)
    }
  })
})
