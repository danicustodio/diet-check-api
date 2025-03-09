import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { NestCreateAccountUseCase } from '../nest-use-cases/nest-create-account'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [NestCreateAccountUseCase],
})
export class HttpModule {}
