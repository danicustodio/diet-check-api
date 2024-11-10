import type { EntityError } from './entity-error'

export class InvalidEmailError extends Error implements EntityError {
	constructor(email: string) {
		const message = `Invalid email format: "${email}". Please provide a valid email address in the following format: "user@example.com"`

		super(message)
		this.name = 'InvalidEmailError'
	}
}
