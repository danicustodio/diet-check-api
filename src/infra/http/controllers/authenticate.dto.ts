import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const authSchema = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string(),
  })
)

export class AuthDTO extends createZodDto(authSchema) {}

export const AuthSuccessResponse = z.object({
  accessToken: z.string(),
  message: z.string(),
})
export class AuthSuccessResponseDTO extends createZodDto(AuthSuccessResponse) {}
