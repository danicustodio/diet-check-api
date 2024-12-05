import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShortLengthError } from '@/core/errors/short-length-error'

interface MealProps {
	name: string
	description?: string | null
	datetime: Date
	isWithinTheDiet: boolean
	accountId: UniqueEntityID
}

export class Meal extends Entity<MealProps> {
	get name() {
		return this.props.name
	}

	get description() {
		return this.props.description
	}

	get datetime() {
		return this.props.datetime
	}

	get isWithinTheDiet() {
		return this.props.isWithinTheDiet
	}

	get accountId() {
		return this.props.accountId
	}

	static create(props: MealProps, id?: UniqueEntityID): Meal {
		if (props.name.length < 3) {
			throw new ShortLengthError('Meal name', 3)
		}

		if (props.description && props.description.length < 3) {
			throw new ShortLengthError('Meal description', 3)
		}

		return new Meal(props, id)
	}
}
