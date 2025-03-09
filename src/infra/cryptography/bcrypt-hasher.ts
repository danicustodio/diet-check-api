import type { HashGenerator } from '@/domain/account/cryptography/hash-generator'
import { hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator {
  private HASH_SALT_LENGTH = 8

  async hash(value: string): Promise<string> {
    return hash(value, this.HASH_SALT_LENGTH)
  }
}
