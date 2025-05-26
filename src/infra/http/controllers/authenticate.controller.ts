import { isLeft, unwrapEither } from '@/core/either'
// biome-ignore lint/style/useImportType: <explanation>
import { NestAuthenticateUseCase } from '@/infra/nest-use-cases/nest-authenticate'
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthDTO, AuthSuccessResponseDTO, authSchema } from './authenticate.dto'

@Controller('/account')
export class AuthenticateController {
  constructor(private authenticate: NestAuthenticateUseCase) {}

  @Post('/signin')
  @UsePipes(new ZodValidationPipe(authSchema))
  @ApiBody({ type: AuthDTO })
  @ApiAcceptedResponse({
    description: 'Authenticated successfully',
    type: AuthSuccessResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  async handle(@Body() authDto: AuthDTO) {
    const { email, password } = authDto

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      switch (error.constructor.name) {
        case 'WrongCredentialsError':
          throw new UnauthorizedException({
            message: `${error.message}`,
          })
        default:
          throw new InternalServerErrorException({
            message: 'Internal Server Error',
          })
      }
    }

    const { accessToken } = unwrapEither(result)

    return {
      accessToken,
      message: 'Authenticated successfully',
    }
  }
}
