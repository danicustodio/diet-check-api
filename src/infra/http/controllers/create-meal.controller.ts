import { Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('/meals')
@UseGuards(AuthGuard)
export class CreateMealController {
  // constructor() {}

  async handle() {
    return 'ok'
  }
}
