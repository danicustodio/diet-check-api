import { ShortLengthError } from '@/core/errors/short-length-error'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MealRepository } from '../repositories/meal-repository'
import { CreateMealUseCase } from './create-meal'
import { isRight, unwrapEither, isLeft } from '@/core/either'

describe('Create Meal Use Case:', () => {
  let mealRepository: MealRepository
  let sut: CreateMealUseCase

  beforeEach(() => {
    mealRepository = new InMemoryMealRepository()
    sut = new CreateMealUseCase(mealRepository)
  })

  it('should create a new meal', async () => {
    const result = await sut.execute({
      name: 'Lunch',
      description: 'A delicious meal',
      datetime: new Date(),
      isWithinTheDiet: true,
      accountId: '123',
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { meal } = unwrapEither(result)
      expect(meal.id).toBeDefined()
    }
  })

  it('should throw an error if the name is too short', async () => {
    const result = await sut.execute({
      name: 'L',
      description: 'A delicious meal',
      datetime: new Date(),
      isWithinTheDiet: true,
      accountId: '123',
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(ShortLengthError)
      expect(unwrapEither(result).message).toBe(
        'Meal name must be at least 3 characters long'
      )
    }
  })

  it('should throw an error if the description is too short', async () => {
    const result = await sut.execute({
      name: 'Lunch',
      description: 'A',
      datetime: new Date(),
      isWithinTheDiet: true,
      accountId: '123',
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(ShortLengthError)
      expect(unwrapEither(result).message).toBe(
        'Meal description must be at least 3 characters long'
      )
    }
  })
})
