import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors'
import { makeMeal } from '@/tests/factories/make-meal'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteMealUseCase } from './delete-meal'
import { isRight, unwrapEither, isLeft } from '@/core/either'

describe('Delete Meal Use Case', () => {
  let mealRepository: InMemoryMealRepository
  let sut: DeleteMealUseCase

  beforeEach(() => {
    mealRepository = new InMemoryMealRepository()
    sut = new DeleteMealUseCase(mealRepository)
  })

  it('should be able to delete a meal', async () => {
    const accountId = new UniqueEntityID(randomUUID())

    const mockMeal = makeMeal({ accountId })
    mealRepository.create(mockMeal)

    const result = await sut.execute({
      accountId: accountId.toString(),
      mealId: mockMeal.id.toString(),
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { meal } = unwrapEither(result)
      expect(meal).toBe(mockMeal)
    }
  })

  it('should return an error if the meal does not exist', async () => {
    const result = await sut.execute({
      accountId: randomUUID(),
      mealId: randomUUID(),
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the meal belongs to another account', async () => {
    const accountId = new UniqueEntityID(randomUUID())
    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      accountId: randomUUID(),
      mealId: meal.id.toString(),
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFoundError)
  })
})
