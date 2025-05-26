// biome-ignore lint/style/useImportType: <explanation>
import { Encrypter } from '@/domain/account/cryptography/encrypter'
// biome-ignore lint/style/useImportType: <explanation>
import { HashComparer } from '@/domain/account/cryptography/hash-comparer'
// biome-ignore lint/style/useImportType: <explanation>
import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { AuthenticateAccountUseCase } from '@/domain/account/use-cases/authenticate-account'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestAuthenticateUseCase extends AuthenticateAccountUseCase {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(
    repository: AccountRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter
  ) {
    super(repository, hashComparer, encrypter)
  }
}
