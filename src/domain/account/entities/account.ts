import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InvalidEmailError, InvalidNameError } from '@/core/errors'
import { Email } from './value-objects/email'

export interface AccountProps {
  email: Email
  name: string
  password: string
}

export class Account extends Entity<AccountProps> {
  get email() {
    return this.props.email.email
  }

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  static create(props: AccountProps, id?: UniqueEntityID): Account {
    const { email, name } = props

    if (name.length < 3) {
      throw new InvalidNameError(name)
    }

    if (!Email.isValid(email.email)) {
      throw new InvalidEmailError(email.email)
    }

    return new Account(props, id)
  }
}
