import { isLeft, isRight, unwrapEither } from '@/core/either'
import { InvalidEmailError, InvalidNameError } from '@/core/errors'
import { DuplicatedResourceError } from '@/core/errors/duplicated-resource-error'
import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { makeAccount } from '@/tests/factories/make-account'
import { InMemoryAccountRepository } from '@/tests/repositories/in-memory-account-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { AccountRepository } from '../repositories/account-repository'
import { CreateAccountUseCase } from './create-account'

describe('Create Account Use Case:', () => {
  let accountRepository: AccountRepository
  let hashGenerator: HashGenerator
  let sut: CreateAccountUseCase

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository()
    hashGenerator = new FakeHasher()
    sut = new CreateAccountUseCase(accountRepository, hashGenerator)
  })

  it('should create an account', async () => {
    const result = await sut.execute(makeAccount())

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
    const account = makeAccount()

    const result = await sut.execute({
      email: 'invalid_email',
      name: account.name,
      password: account.password,
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(InvalidEmailError)
    }
  })

  it('should throw an error if the name is invalid', async () => {
    const account = makeAccount()

    const result = await sut.execute({
      email: account.email,
      name: 'T',
      password: account.password,
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(InvalidNameError)
    }
  })

  it('should hash the password when the account is created', async () => {
    const account = makeAccount()
    const result = await sut.execute({
      email: account.email,
      name: account.name,
      password: account.password,
    })

    const hashedPassword = await hashGenerator.hash(account.password)

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { account } = unwrapEither(result)
      expect(account.password).toEqual(hashedPassword)
    }
  })
})
