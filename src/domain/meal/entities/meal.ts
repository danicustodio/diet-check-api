import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShortLengthError } from '@/core/errors/short-length-error'

const MIN_NAME_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 3

export interface MealProps {
	name: string
	description: string | null
	datetime: Date
	isWithinTheDiet: boolean
	accountId: UniqueEntityID
}

export class Meal extends Entity<MealProps> {
	get name() {
		return this.props.name
	}

	set name(name: string) {
		if (name.length < MIN_NAME_LENGTH) {
			throw new ShortLengthError('Meal name', MIN_NAME_LENGTH)
		}

		this.props.name = name
	}

	get description() {
		return this.props.description
	}

	set description(description: string | null) {
		if (description && description.length < MIN_DESCRIPTION_LENGTH) {
			throw new ShortLengthError('Meal description', MIN_DESCRIPTION_LENGTH)
		}

		this.props.description = description
	}

	get datetime() {
		return this.props.datetime
	}

	set datetime(datetime: Date) {
		this.props.datetime = datetime
	}

	get isWithinTheDiet() {
		return this.props.isWithinTheDiet
	}

	set isWithinTheDiet(isWithinTheDiet: boolean) {
		this.props.isWithinTheDiet = isWithinTheDiet
	}

	get accountId() {
		return this.props.accountId
	}

	static create(props: MealProps, id?: UniqueEntityID): Meal {
		const { name, description } = props

		if (name.length < MIN_NAME_LENGTH) {
			throw new ShortLengthError('Meal name', MIN_NAME_LENGTH)
		}

		if (description && description.length < MIN_DESCRIPTION_LENGTH) {
			throw new ShortLengthError('Meal description', MIN_DESCRIPTION_LENGTH)
		}

		return new Meal(props, id)
	}
}
