import { EntityError } from './entity-error'

export class InvalidPasswordError extends EntityError {
	constructor(password: string) {
		const message = `Invalid password: "${password}". Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. The password must not contain any spaces or tabs.`

		super(message)
		this.name = 'InvalidPasswordError'
	}
}
