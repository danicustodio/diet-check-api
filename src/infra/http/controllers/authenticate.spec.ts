import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AccountInMemoryFactory } from '@/tests/factories/make-account'
import { MockDatabaseModule } from '@/tests/mock-database.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate Controller', () => {
  let app: INestApplication
  let accountFactory: AccountInMemoryFactory

  const endpoint = '/account/signin'

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountInMemoryFactory],
    })
      .overrideModule(DatabaseModule)
      .useModule(MockDatabaseModule)
      .compile()

    accountFactory = moduleRef.get(AccountInMemoryFactory)

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('should return 200 when account is authenticated successfully', async () => {
    const account = await accountFactory.makeAccount({
      password: await hash('@Password123', 8),
    })

    const response = await request(app.getHttpServer()).post(endpoint).send({
      email: account.email,
      password: account.password,
    })

    expect(response.status).toBe(200)
    expect(response.body.accessToken).toBeDefined()
  })
  it('should return 401 when the e-mail is invalid', async () => {})
  it('should return 401 when the password is invalid', async () => {})
  it('should return 401 when the account does not exist', async () => {})
})
