import { type Either, makeRight } from '@/core/either'
import type { Meal } from '@/domain/meal/entities/meal'
import type { MealRepository } from '@/domain/meal/repositories/meal-repository'

interface Metrics {
  insideDiet: number
  outsideDiet: number
  longestStreak: number
  totalMeals: number
}

interface GetDietMetricsUseCaseRequest {
  accountId: string
}

type GetDietMetricsUseCaseResponse = Either<Error, { metrics: Metrics }>

export class GetDietMetricsUseCase {
  constructor(private mealRepository: MealRepository) {}

  async execute({
    accountId,
  }: GetDietMetricsUseCaseRequest): Promise<GetDietMetricsUseCaseResponse> {
    const meals = await this.mealRepository.findAll(accountId)
    const metrics = {
      insideDiet: meals.filter(meal => meal.isWithinTheDiet).length,
      outsideDiet: meals.filter(meal => !meal.isWithinTheDiet).length,
      longestStreak: this.getLongestStreak(meals),
      totalMeals: meals.length,
    }

    return makeRight({ metrics })
  }

  private getLongestStreak(meals: Meal[]): number {
    if (!meals?.length) return 0

    const sortedMeals = [...meals].sort(
      (a, b) => a.datetime.getTime() - b.datetime.getTime()
    )

    let longestStreak = 0
    let currentStreak = 0
    let previousDate: Date | null = null

    for (const meal of sortedMeals) {
      if (meal.isWithinTheDiet) {
        if (
          previousDate &&
          this.isConsecutiveDay(meal.datetime, previousDate)
        ) {
          currentStreak++
        } else {
          currentStreak = 1
        }

        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }

      previousDate = meal.datetime
    }

    return longestStreak
  }

  private isConsecutiveDay(date: Date, previousDate: Date) {
    return (
      date.getDate() - previousDate.getDate() === 1 &&
      date.getMonth() === previousDate.getMonth() &&
      date.getFullYear() === previousDate.getFullYear()
    )
  }
}
