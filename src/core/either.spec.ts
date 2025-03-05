import { describe, expect, it } from 'vitest'
import {
  type Either,
  isLeft,
  isRight,
  makeLeft,
  makeRight,
  unwrapEither,
} from './either'

describe('Either', () => {
  it('should return a success value', () => {
    const result = doSomeOperation(true)
    expect(isRight(result)).toBe(true)
    expect(unwrapEither(result)).toBe(16)
    expect(isLeft(result)).toBe(false)
  })
  it('should return a failure value', () => {
    const result = doSomeOperation(false)
    expect(isRight(result)).toBe(false)
    expect(unwrapEither(result)).toBe('Failed to complete operation')
    expect(isLeft(result)).toBe(true)
  })
})

function doSomeOperation(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) {
    return makeRight(16)
  }

  return makeLeft('Failed to complete operation')
}
