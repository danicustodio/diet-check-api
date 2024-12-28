import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Meal, type MealProps } from '@/domain/meal/entities/meal'
import { faker } from '@faker-js/faker'

export function makeMeal(overrides: Partial<MealProps> = {}): Meal {
	return Meal.create({
		name: faker.food.dish(),
		description: faker.food.description(),
		datetime: faker.date.between({ from: '2020-01-01', to: '2023-12-31' }),
		isWithinTheDiet: false,
		accountId: new UniqueEntityID(randomUUID()),
		...overrides,
	})
}

export function makeMeals(
	overrides: Partial<MealProps> = {},
	count = 2
): Meal[] {
	return Array.from({ length: count }, () => makeMeal(overrides))
}

export function makeMealsInAStreak(
	overrides: Partial<MealProps> = {},
	streak = 3,
	initialDate = new Date(2023, 1, 1)
): Meal[] {
	const daysInMiliseconds = 24 * 60 * 60 * 1000
	const meals: Meal[] = []
	for (let i = 0; i < streak; i++) {
		meals.push(
			makeMeal({
				...overrides,
				datetime: new Date(initialDate.getTime() + i * daysInMiliseconds),
			})
		)
	}

	return meals
}
