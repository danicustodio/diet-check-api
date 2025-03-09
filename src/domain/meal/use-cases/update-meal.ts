import { type Either, makeLeft, makeRight } from '@/core/either'
import { EntityError, ResourceNotFoundError } from '@/core/errors'
import type { Meal } from '../entities/meal'
import type { MealRepository } from '../repositories/meal-repository'

interface UpdateMealUseCaseRequest {
  name?: string
  description?: string | null
  isWithinTheDiet?: boolean
  dateTime?: Date
  mealId: string
  accountId: string
}

type UpdateMealUseCaseResponse = Either<Error, { meal: Meal }>

export class UpdateMealUseCase {
  constructor(private mealRepository: MealRepository) {}

  async execute({
    name,
    description,
    isWithinTheDiet,
    dateTime,
    mealId,
    accountId,
  }: UpdateMealUseCaseRequest): Promise<UpdateMealUseCaseResponse> {
    try {
      const meal = await this.mealRepository.findById(mealId, accountId)
      if (!meal) {
        return makeLeft(new ResourceNotFoundError('Meal not found'))
      }

      if (name && name !== meal.name) {
        meal.name = name
      }

      if (description !== undefined) {
        meal.description = description
      }

      if (isWithinTheDiet !== undefined) {
        meal.isWithinTheDiet = isWithinTheDiet
      }

      if (dateTime) {
        meal.datetime = dateTime
      }

      await this.mealRepository.update(meal)

      return makeRight({ meal })
    } catch (error) {
      if (error instanceof EntityError) {
        return makeLeft(error)
      }
      const typedError = error as Error
      return makeLeft(typedError)
    }
  }
}
