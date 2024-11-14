import type { UseCaseError } from './use-case-error'

export class WrongPasswordError extends Error implements UseCaseError {
	constructor(message?: string) {
		super(message || 'Wrong password')
		this.name = 'WrongPasswordError'
	}
}
