import type { Meal } from '../entities/meal'

export interface MealRepository {
	findAll(accountId: string): Promise<Meal[]>
	findById(id: string, accountId: string): Promise<Meal | null>
	create(meal: Meal): Promise<void>
	update(meal: Meal): Promise<Meal>
	delete(meal: Meal): Promise<void>
}
