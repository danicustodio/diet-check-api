export interface HashingService {
	hash(password: string): string
	compare(plainPassword: string, hashedPassword: string): boolean
}
