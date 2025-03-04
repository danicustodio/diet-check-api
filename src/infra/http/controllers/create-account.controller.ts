// biome-ignore lint/style/useImportType: <explanation>
import { NestCreateAccountUseCase } from '@/infra/nest-use-cases/nest-create-account'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBody = z.input<typeof createAccountBodySchema>

@Controller('/account')
export class CreateAccountController {
  constructor(private createAccount: NestCreateAccountUseCase) {}

  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const account = await this.createAccount.execute({ name, email, password })

    return account
  }
}
