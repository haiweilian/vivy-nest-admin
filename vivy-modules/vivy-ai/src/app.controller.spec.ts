import { Test } from '@nestjs/testing'
import { describe, expect, it, vi } from 'vitest'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

describe('AppController', () => {
  it('returns the result from the injected service', async () => {
    const service = { getHello: vi.fn().mockReturnValue('hello from the AI service') }
    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: service }],
    }).compile()

    try {
      expect(module.get(AppController).getHello()).toBe('hello from the AI service')
      expect(service.getHello).toHaveBeenCalledOnce()
    } finally {
      await module.close()
    }
  })
})
