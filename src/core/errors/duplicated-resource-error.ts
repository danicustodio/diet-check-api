import { UseCaseError } from './use-case-error'

export class DuplicatedResourceError extends UseCaseError {
	constructor(message?: string) {
		super(message || 'Duplicated resource')
		this.name = 'DuplicatedResourceError'
	}
}
