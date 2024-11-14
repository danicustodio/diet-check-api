import { type Either, left, right } from '@/core/either'
import { InvalidEmailError } from '@/core/errors'
import type { Account } from '../entities/account'
import { Email } from '../entities/value-objects/email'
import type { AccountRepository } from '../repositories/account-repository'

interface SearchAccountUseCaseRequest {
	email: string
}

type SearchAccountUseCaseResponse = Either<
	InvalidEmailError,
	{ account: Account | null }
>

export class SearchAccountUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute({
		email,
	}: SearchAccountUseCaseRequest): Promise<SearchAccountUseCaseResponse> {
		if (!Email.isValid(email)) {
			return left(new InvalidEmailError(email))
		}

		const account = await this.accountRepository.findByEmail(email)

		return right({ account })
	}
}
