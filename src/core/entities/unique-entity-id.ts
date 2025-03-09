import { uuidv7 } from 'uuidv7'

export class UniqueEntityID {
  private value: string

  constructor(value?: string) {
    this.value = value ?? uuidv7()
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  public equals(id: UniqueEntityID) {
    return this.value === id.value
  }
}
