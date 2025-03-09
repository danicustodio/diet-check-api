import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors'
import { ShortLengthError } from '@/core/errors/short-length-error'
import { makeMeal } from '@/tests/factories/make-meal'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateMealUseCase } from './update-meal'
import { isRight, unwrapEither, isLeft } from '@/core/either'

describe('Update Meal Use Case', () => {
  let mealRepository: InMemoryMealRepository
  let sut: UpdateMealUseCase

  beforeEach(() => {
    mealRepository = new InMemoryMealRepository()
    sut = new UpdateMealUseCase(mealRepository)
  })

  it('should be able to update a meal', async () => {
    const accountId = new UniqueEntityID(randomUUID())
    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      name: 'Updated Lunch',
      description: 'A delicious updated meal',
      mealId: meal.id.toString(),
      accountId: accountId.toString(),
    })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      const { meal: updatedMeal } = unwrapEither(result)
      expect(updatedMeal.id).toBe(meal.id)
      expect(updatedMeal.name).toBe('Updated Lunch')
      expect(updatedMeal.description).toBe('A delicious updated meal')
    }
  })

  it('should only update if the meal belongs to the account', async () => {
    const accountId = new UniqueEntityID(randomUUID())
    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      name: 'Updated Lunch',
      description: 'A delicious updated meal',
      accountId: randomUUID(),
      mealId: meal.id.toString(),
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw an error if the meal does not exist', async () => {
    const accountId = new UniqueEntityID(randomUUID())
    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      name: 'Updated Lunch',
      description: 'A delicious updated meal',
      mealId: randomUUID(),
      accountId: accountId.toString(),
    })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the name is too short', async () => {
    const accountId = new UniqueEntityID(randomUUID())

    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      name: 'L',
      description: 'A delicious meal',
      mealId: meal.id.toString(),
      accountId: accountId.toString(),
    })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(ShortLengthError)
      expect(unwrapEither(result).message).toBe(
        'Meal name must be at least 3 characters long'
      )
    }
  })

  it('should return an error if the description is too short', async () => {
    const accountId = new UniqueEntityID(randomUUID())

    const meal = makeMeal({ accountId })
    mealRepository.create(meal)

    const result = await sut.execute({
      name: 'Lunch',
      description: 'A',
      mealId: meal.id.toString(),
      accountId: accountId.toString(),
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
