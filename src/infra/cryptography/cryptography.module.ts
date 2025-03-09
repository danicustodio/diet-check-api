import { HashGenerator } from '@/domain/account/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [{ provide: HashGenerator, useClass: BcryptHasher }],
  exports: [HashGenerator],
})
export class CryptographyModule {}
