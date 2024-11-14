import type { Account } from '@/domain/account/entities/account'
import type { AccountRepository } from '@/domain/account/repositories/account-repository'

export class InMemoryAccountRepository implements AccountRepository {
	public accounts: Account[] = []

	async create(account: Account): Promise<void> {
		this.accounts.push(account)
	}

	async findByEmail(email: string): Promise<Account | null> {
		const account = this.accounts.find((u) => u.email === email)
		return account || null
	}
}
