import { EntityError } from './entity-error'

export class InvalidNameError extends EntityError {
	constructor(name: string) {
		const message = `Invalid name: "${name}". Name must be at least 3 characters long`

		super(message)
		this.name = 'InvalidNameError'
	}
}
