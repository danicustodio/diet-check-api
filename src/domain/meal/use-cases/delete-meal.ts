import { type Either, makeLeft, makeRight } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors'
import type { Meal } from '../entities/meal'
import type { MealRepository } from '../repositories/meal-repository'

interface DeleteMealUseCaseRequest {
  mealId: string
  accountId: string
}

type DeleteMealUseCaseResponse = Either<Error, { meal: Meal }>

export class DeleteMealUseCase {
  constructor(private mealRepository: MealRepository) {}

  async execute({
    mealId,
    accountId,
  }: DeleteMealUseCaseRequest): Promise<DeleteMealUseCaseResponse> {
    const meal = await this.mealRepository.findById(mealId, accountId)
    if (!meal) {
      return makeLeft(new ResourceNotFoundError('Meal not found'))
    }

    await this.mealRepository.delete(meal)

    return makeRight({ meal })
  }
}
