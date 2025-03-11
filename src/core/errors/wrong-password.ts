import type { UseCaseError } from './use-case-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Invalid credentials')
    this.name = 'InvalidCredentialsError'
  }
}
