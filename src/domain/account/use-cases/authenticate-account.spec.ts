import { isLeft, isRight, unwrapEither } from '@/core/either'
import { WrongCredentialsError } from '@/core/errors'
import { FakeEncrypter } from '@/tests/cryptography/fake-encrypter'
import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { makeAccount } from '@/tests/factories/make-account'
import { InMemoryAccountRepository } from '@/tests/repositories/in-memory-account-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Encrypter } from '../cryptography/encrypter'
import type { AccountRepository } from '../repositories/account-repository'
import { AuthenticateAccountUseCase } from './authenticate-account'

describe('Authenticate Account Use Case', () => {
  let accountRepository: AccountRepository
  let fakeHasher: FakeHasher
  let encrypter: Encrypter
  let sut: AuthenticateAccountUseCase

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateAccountUseCase(
      accountRepository,
      fakeHasher,
      encrypter
    )
  })

  it('should return an accessToken when the right credentials are provided', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash('@Password123'),
    })
    await accountRepository.create(account)

    const result = await sut.execute({
      email: account.email,
      password: '@Password123',
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { accessToken } = unwrapEither(result)
      expect(accessToken).toBeDefined()
    }
  })

  it('should return an error when the wrong email is provided', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash('@Password123'),
    })
    await accountRepository.create(account)

    const result = await sut.execute({
      email: 'wrong-email',
      password: '@Password123',
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)
  })

  it('should return an error when the wrong password is provided', async () => {
    const account = makeAccount({
      password: await fakeHasher.hash('@Password123'),
    })
    await accountRepository.create(account)

    const result = await sut.execute({
      email: account.email,
      password: 'wrong-password',
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)
  })
})
