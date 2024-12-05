import { ShortLengthError } from '@/core/errors/short-length-error'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MealRepository } from '../repositories/meal-repository'
import { CreateMealUseCase } from './create-meal'

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

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { meal } = result.value
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

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ShortLengthError)
			expect(result.value.message).toBe(
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

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ShortLengthError)
			expect(result.value.message).toBe(
				'Meal description must be at least 3 characters long'
			)
		}
	})
})
