import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { AppController } from '../src/app.controller.js'
import { AppService } from '../src/app.service.js'

describe('Vivy System HTTP smoke test', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app?.close()
  })

  it('GET / returns the system greeting', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('Hello World Vivy System!')
  })
})
