import type { UserRepository } from '@/domain/user-management/application/repositories/user-repository'
import type { User } from '@/domain/user-management/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
	public users: User[] = []

	async create(user: User): Promise<void> {
		this.users.push(user)
	}
}
