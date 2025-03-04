import { CreateAccountUseCase } from '@/domain/account/use-cases/create-account'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateAccountUseCase extends CreateAccountUseCase {}
