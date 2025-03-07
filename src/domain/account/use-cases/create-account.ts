import { type Either, left, right } from '@/core/either'
import { EntityError } from '@/core/errors'
import { DuplicatedResourceError } from '@/core/errors/duplicated-resource-error'
import { Account } from '../entities/account'
import { Email } from '../entities/value-objects/email'
import { Password } from '../entities/value-objects/password'
import type { AccountRepository } from '../repositories/account-repository'

interface AccountUseCaseRequest {
	name: string
	email: string
	password: string
}

type AccountUseCaseResponse = Either<
	DuplicatedResourceError | EntityError | Error,
	{
		account: Account
	}
>

export class CreateAccountUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute({
		email,
		name,
		password,
	}: AccountUseCaseRequest): Promise<AccountUseCaseResponse> {
		try {
			const doesAccountExist = await this.accountRepository.findByEmail(email)
			if (doesAccountExist) {
				return left(new DuplicatedResourceError('Account already exists'))
			}

			const account = Account.create({
				email: new Email(email),
				name,
				password: new Password(password),
			})

			await this.accountRepository.create(account)

			return right({ account })
		} catch (error) {
			if (error instanceof EntityError) {
				return left(error)
			}

			const typedError = error as Error
			return left(typedError)
		}
	}
}
