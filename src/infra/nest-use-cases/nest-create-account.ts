// biome-ignore lint/style/useImportType: <explanation>
import { AccountRepository } from '@/domain/account/repositories/account-repository'
import { CreateAccountUseCase } from '@/domain/account/use-cases/create-account'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateAccountUseCase extends CreateAccountUseCase {
  // biome-ignore lint/complexity/noUselessConstructor: <explanation>
  constructor(repository: AccountRepository) {
    super(repository)
  }
}
