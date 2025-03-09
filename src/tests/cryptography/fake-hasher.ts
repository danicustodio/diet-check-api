import type { HashGenerator } from '@/domain/account/cryptography/hash-generator'

export class FakeHasher implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`
  }
}
