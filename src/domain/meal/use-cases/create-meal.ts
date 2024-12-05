import { type Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EntityError } from '@/core/errors'
import { Meal } from '../entities/meal'
import type { MealRepository } from '../repositories/meal-repository'

interface MealUseCaseRequest {
	name: string
	description: string
	datetime: Date
	isWithinTheDiet: boolean
	accountId: string
}

type MealUseCaseResponse = Either<Error, { meal: Meal }>

export class CreateMealUseCase {
	constructor(private readonly mealRepository: MealRepository) {}

	async execute({
		name,
		description,
		datetime,
		isWithinTheDiet,
		accountId,
	}: MealUseCaseRequest): Promise<MealUseCaseResponse> {
		try {
			const meal = Meal.create({
				name,
				description,
				datetime,
				isWithinTheDiet,
				accountId: new UniqueEntityID(accountId),
			})

			await this.mealRepository.create(meal)

			return right({ meal })
		} catch (error) {
			if (error instanceof EntityError) {
				return left(error)
			}
			const typedError = error as Error
			return left(typedError)
		}
	}
}
