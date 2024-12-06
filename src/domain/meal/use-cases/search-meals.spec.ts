import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors'
import { makeMeals } from '@/tests/factories/make-meal'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchMealsUseCase } from './search-meals'

describe('Search Meals Use Case', () => {
	let mealRepository: InMemoryMealRepository
	let searchMealsUseCase: SearchMealsUseCase

	beforeEach(() => {
		mealRepository = new InMemoryMealRepository()
		searchMealsUseCase = new SearchMealsUseCase(mealRepository)
	})

	it('should return a list with all meals of a user', async () => {
		const accountId = new UniqueEntityID(randomUUID())

		const meals = makeMeals({ accountId })
		mealRepository.create(meals[0])
		mealRepository.create(meals[1])

		const result = await searchMealsUseCase.execute({
			accountId: accountId.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { meals } = result.value
			expect(meals).toBeInstanceOf(Array)
			if (Array.isArray(meals)) {
				expect(meals.length).toBe(2)
			}
		}
	})
	it('should return an empty list if no meals are found', async () => {
		const accountId = new UniqueEntityID(randomUUID())

		const result = await searchMealsUseCase.execute({
			accountId: accountId.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { meals } = result.value
			expect(meals).toBeInstanceOf(Array)
			if (Array.isArray(meals)) {
				expect(meals.length).toBe(0)
			}
		}
	})
	it('should return a meal', async () => {
		const accountId = new UniqueEntityID(randomUUID())

		const mockMeals = makeMeals({ accountId })
		mealRepository.create(mockMeals[0])
		mealRepository.create(mockMeals[1])

		const result = await searchMealsUseCase.execute({
			accountId: accountId.toString(),
			mealId: mockMeals[0].id.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { meals } = result.value
			expect(meals).toBe(mockMeals[0])
		}
	})
	it('should return an error if the meal does not exist', async () => {
		const accountId = new UniqueEntityID(randomUUID())

		const mockMeals = makeMeals({ accountId })
		mealRepository.create(mockMeals[0])
		mealRepository.create(mockMeals[1])

		const result = await searchMealsUseCase.execute({
			accountId: accountId.toString(),
			mealId: new UniqueEntityID(randomUUID()).toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
