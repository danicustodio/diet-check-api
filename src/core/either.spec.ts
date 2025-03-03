import { describe, expect, it } from 'vitest'
import { type Either, left, right } from './either'

describe('Either', () => {
  it('should return a success value', () => {
    const result = doSomeOperation(true)
    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(16)
    expect(result.isLeft()).toBe(false)
  })
  it('should return a failure value', () => {
    const result = doSomeOperation(false)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBe('Failed to complete operation')
    expect(result.isLeft()).toBe(true)
  })
})

function doSomeOperation(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) {
    return right(16)
  }

  return left('Failed to complete operation')
}
