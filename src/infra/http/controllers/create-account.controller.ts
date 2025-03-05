// biome-ignore lint/style/useImportType: <explanation>
import { NestCreateAccountUseCase } from '@/infra/nest-use-cases/nest-create-account'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateAccountDTO, createAccountSchema } from './create-account.dto'

@Controller('/account')
export class CreateAccountController {
  constructor(private createAccount: NestCreateAccountUseCase) {}

  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @ApiCreatedResponse({ type: CreateAccountDTO })
  async handle(@Body() createAccountDto: CreateAccountDTO) {
    const { name, email, password } = createAccountDto

    const account = await this.createAccount.execute({ name, email, password })

    return account
  }
}
