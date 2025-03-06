import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import {
  AccountInMemoryFactory,
  makeAccount,
} from '@/tests/factories/make-account'
import { MockDatabaseModule } from '@/tests/mock-database.module'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Create Account Controller', () => {
  let app: INestApplication
  let accountFactory: AccountInMemoryFactory
  const endpoint = '/account/signup'

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

  it('should return 201 when account is created successfully', async () => {
    const user = makeAccount()
    const response = await request(app.getHttpServer()).post(endpoint).send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.message).toEqual('Account created successfully')
  })
  it('should return 409 when an account with the same e-mail already exists', async () => {
    const user = await accountFactory.makeAccount()

    const response = await request(app.getHttpServer()).post(endpoint).send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    expect(response.body.message).toEqual('Account already exists')
    expect(response.statusCode).toBe(409)
  })
  it('should return 400 when the e-mail is invalid', async () => {
    const user = makeAccount()
    const response = await request(app.getHttpServer()).post(endpoint).send({
      name: user.name,
      email: 'invalidemail',
      password: user.password,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Validation failed')
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.details[0].message).toEqual('Invalid email')
  })
  it('should return 400 when the name is invalid', async () => {
    const user = makeAccount()
    const response = await request(app.getHttpServer()).post(endpoint).send({
      name: 'na',
      email: user.email,
      password: user.password,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Validation failed')
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.details[0].message).toEqual(
      'Must have at least 3 characters'
    )
  })
  it('should return 400 when the password is invalid', async () => {
    const user = makeAccount()
    const response = await request(app.getHttpServer()).post(endpoint).send({
      name: user.name,
      email: user.email,
      password: 'invalidpassword',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Validation failed')
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors.details[0].message).toEqual(
      'Must have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    )
  })
  it.skip('should hash the password when the account is created', () => {})
})
