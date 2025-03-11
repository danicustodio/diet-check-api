import { type Either, makeLeft, makeRight } from '@/core/either'
import { WrongCredentialsError } from '@/core/errors'
import type { Encrypter } from '../cryptography/encrypter'
import type { HashComparer } from '../cryptography/hash-comparer'
import type { AccountRepository } from '../repositories/account-repository'

interface AuthenticateAccountUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAccountUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email)

    if (!account) {
      return makeLeft(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      account.password
    )

    if (!isPasswordValid) {
      return makeLeft(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    })

    return makeRight({ accessToken })
  }
}
