import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors'
import { ShortLengthError } from '@/core/errors/short-length-error'
import { makeMeal } from '@/tests/factories/make-meal'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateMealUseCase } from './update-meal'

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

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { meal: updatedMeal } = result.value
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

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
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

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
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

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ShortLengthError)
			expect(result.value.message).toBe(
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

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ShortLengthError)
			expect(result.value.message).toBe(
				'Meal description must be at least 3 characters long'
			)
		}
	})
})
