import type { Account } from '../entities/account'

export interface AccountRepository {
	create(account: Account): Promise<void>
	findByEmail(email: string): Promise<Account | null>
}
