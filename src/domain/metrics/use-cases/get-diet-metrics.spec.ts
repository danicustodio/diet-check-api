import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeMeals, makeMealsInAStreak } from '@/tests/factories/make-meal'
import { InMemoryMealRepository } from '@/tests/repositories/in-memory-meal-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetDietMetricsUseCase } from './get-diet-metrics'

describe('Get Diet Metrics Use Case', () => {
	let mealRepository: InMemoryMealRepository
	let sut: GetDietMetricsUseCase

	beforeEach(() => {
		mealRepository = new InMemoryMealRepository()
		sut = new GetDietMetricsUseCase(mealRepository)
	})

	it('should be able to get diet metrics', async () => {
		const accountId = new UniqueEntityID()
		const mealsWithinDietInAStreak = makeMealsInAStreak(
			{
				accountId,
				isWithinTheDiet: true,
			},
			3,
			new Date(2019, 10, 13)
		)
		const mealsWithinDiet = makeMeals({ accountId, isWithinTheDiet: true }, 2)
		const mealsOutsideDiet = makeMeals({ accountId, isWithinTheDiet: false }, 3)
		const meals = [
			...mealsWithinDietInAStreak,
			...mealsWithinDiet,
			...mealsOutsideDiet,
		]
		for (const meal of meals) {
			mealRepository.create(meal)
		}

		const result = await sut.execute({ accountId: accountId.toString() })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { metrics } = result.value
			expect(metrics).toEqual({
				insideDiet: 5,
				outsideDiet: 3,
				longestStreak: 3,
				totalMeals: 8,
			})
		}
	})

	it('should be able to get diet metrics with longest streak', async () => {
		const accountId = new UniqueEntityID()
		const mealsWithinDietInAStreak = makeMealsInAStreak(
			{ accountId, isWithinTheDiet: true },
			3
		)
		const longestStreak = makeMealsInAStreak(
			{ accountId, isWithinTheDiet: true },
			5,
			new Date(2024, 10, 16)
		)

		const meals = [...mealsWithinDietInAStreak, ...longestStreak]
		for (const meal of meals) {
			mealRepository.create(meal)
		}

		const result = await sut.execute({ accountId: accountId.toString() })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			const { metrics } = result.value
			expect(metrics).toEqual({
				insideDiet: 8,
				outsideDiet: 0,
				longestStreak: 5,
				totalMeals: 8,
			})
		}
	})
})
