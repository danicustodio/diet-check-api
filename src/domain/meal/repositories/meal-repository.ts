import type { Meal } from '../entities/meal'

export interface MealRepository {
	findAll(accountId: string): Promise<Meal[]>
	findById(id: string): Promise<Meal | null>
	create(meal: Meal): Promise<void>
	update(meal: Meal): Promise<Meal>
}
