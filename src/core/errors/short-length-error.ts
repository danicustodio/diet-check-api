import { EntityError } from './entity-error'

export class ShortLengthError extends EntityError {
	constructor(resource: string, minLength: number) {
		const message = `${resource} must be at least ${minLength} characters long`

		super(message)
		this.name = 'ShortLengthError'
	}
}
