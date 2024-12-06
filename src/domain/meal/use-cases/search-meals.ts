import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors'
import type { Meal } from '../entities/meal'
import type { MealRepository } from '../repositories/meal-repository'

interface SearchMealsUseCaseRequest {
	accountId: string
	mealId?: string
}

type SearchMealsUseCaseResponse = Either<Error, { meals: Meal[] | Meal }>

export class SearchMealsUseCase {
	constructor(private mealRepository: MealRepository) {}

	async execute({
		accountId,
		mealId,
	}: SearchMealsUseCaseRequest): Promise<SearchMealsUseCaseResponse> {
		if (mealId) {
			const meals = await this.mealRepository.findById(mealId)
			if (!meals) {
				return left(new ResourceNotFoundError('Meal not found'))
			}
			return right({ meals })
		}

		const meals = await this.mealRepository.findAll(accountId)
		return right({ meals })
	}
}
