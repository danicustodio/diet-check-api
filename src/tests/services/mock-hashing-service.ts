import type { HashingService } from '@/core/services/hashing-service'

export class MockHashingService implements HashingService {
	hash(password: string): string {
		return `hashed-${password}`
	}

	compare(plainPassword: string, hashedPassword: string): boolean {
		return plainPassword === hashedPassword
	}
}
