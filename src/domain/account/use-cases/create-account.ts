import { type Either, makeLeft, makeRight } from '@/core/either'
import type { InvalidEmailError, InvalidNameError } from '@/core/errors'
import { DuplicatedResourceError } from '@/core/errors/duplicated-resource-error'
import { Account } from '../entities/account'
import { Email } from '../entities/value-objects/email'
import type { AccountRepository } from '../repositories/account-repository'

interface AccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type AccountUseCaseResponse = Either<
  DuplicatedResourceError | InvalidNameError | InvalidEmailError,
  {
    account: Account
  }
>

export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute({
    email,
    name,
    password,
  }: AccountUseCaseRequest): Promise<AccountUseCaseResponse> {
    try {
      const doesAccountExist = await this.accountRepository.findByEmail(email)
      if (doesAccountExist) {
        return makeLeft(new DuplicatedResourceError('Account already exists'))
      }

      const account = Account.create({
        email: new Email(email),
        name,
        password,
      })

      await this.accountRepository.create(account)

      return makeRight({ account })
    } catch (error) {
      const typedError = error as Error
      return makeLeft(typedError)
    }
  }
}
