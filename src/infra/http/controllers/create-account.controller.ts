import { isRight, unwrapEither } from '@/core/either'
// biome-ignore lint/style/useImportType: <explanation>
import { NestCreateAccountUseCase } from '@/infra/nest-use-cases/nest-create-account'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateAccountDTO, createAccountSchema } from './create-account.dto'

@Controller('/account')
export class CreateAccountController {
  constructor(private createAccount: NestCreateAccountUseCase) {}

  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @ApiBody({ type: CreateAccountDTO })
  @ApiCreatedResponse({ description: 'Account created successfully' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async handle(@Body() createAccountDto: CreateAccountDTO) {
    const { name, email, password } = createAccountDto

    const result = await this.createAccount.execute({
      name,
      email,
      password,
    })

    if (isRight(result)) {
      return {
        message: 'Account created successfully',
        statusCode: 201,
      }
    }

    const error = unwrapEither(result)
    switch (error.constructor.name) {
      case 'DuplicatedResourceError':
        throw new ConflictException({
          message: `${error.message}`,
        })
      case 'InvalidNameError':
      case 'InvalidEmailError':
        throw new BadRequestException({
          message: `${error.message}`,
        })
      default:
        throw new InternalServerErrorException({
          message: `${error.message}`,
        })
    }
  }
}
