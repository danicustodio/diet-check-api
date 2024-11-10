import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
	private _id: UniqueEntityID
	protected props: Props

	protected constructor(props: Props, id?: UniqueEntityID) {
		this.props = props
		this._id = id ?? new UniqueEntityID()
	}

	get id() {
		return this._id
	}

	// biome-ignore lint/suspicious/noExplicitAny: the equals method is intentionally designed to accept an Entity with any type of Props to allow for comparison based solely on the entity's unique ID, regardless of the entity's properties.
	public equals(entity: Entity<any>) {
		if (entity === this) {
			return true
		}

		if (entity.id === this._id) {
			return true
		}

		return false
	}
}
