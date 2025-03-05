import { InvalidEmailError } from '@/core/errors'
import { makeAccount } from '@/tests/factories/make-account'
import { InMemoryAccountRepository } from '@/tests/repositories/in-memory-account-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { AccountRepository } from '../repositories/account-repository'
import { SearchAccountUseCase } from './search-account'
import { isRight, unwrapEither, isLeft } from '@/core/either'

describe('Search Account Use Case:', () => {
  let accountRepository: AccountRepository
  let sut: SearchAccountUseCase

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository()
    sut = new SearchAccountUseCase(accountRepository)
  })

  it('should search an account', async () => {
    const testAccount = makeAccount()
    accountRepository.create(testAccount)

    const result = await sut.execute({
      email: testAccount.email,
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { account } = unwrapEither(result)
      expect(account?.email).toBe(testAccount.email)
    }
  })

  it('should return null if the account does not exist', async () => {
    const result = await sut.execute({
      email: 'invalid@example.com',
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { account } = unwrapEither(result)
      expect(account).toBeNull()
    }
  })

  it('should throw an error if the email is invalid', async () => {
    const result = await sut.execute({
      email: 'invalid_email',
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(InvalidEmailError)
    }
  })
})
