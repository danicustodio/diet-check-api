import { randomUUID } from 'node:crypto'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Meal, type MealProps } from '@/domain/meal/entities/meal'
import { faker } from '@faker-js/faker'

export function makeMeal(overrides: Partial<MealProps> = {}): Meal {
	return Meal.create({
		name: faker.food.dish(),
		description: faker.food.description(),
		datetime: new Date(),
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
