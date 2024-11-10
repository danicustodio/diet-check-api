import type { User } from '../../enterprise/entities/user'

export interface UserRepository {
	create(user: User): Promise<void>
}
