import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

export const createAccountSchema = extendApi(
  z.object({
    name: z.string().min(3, { message: 'Must have at least 3 characters' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Must have at least 1 character' })
      .regex(passwordValidation, {
        message:
          'Must have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      }),
  })
)

export class CreateAccountDTO extends createZodDto(createAccountSchema) {}
