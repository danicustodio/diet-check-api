import { Module } from '@nestjs/common'
import { NestCreateAccountUseCase } from '../nest-use-cases/nest-create-account'
import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccountController],
  providers: [NestCreateAccountUseCase],
})
export class HttpModule {}
