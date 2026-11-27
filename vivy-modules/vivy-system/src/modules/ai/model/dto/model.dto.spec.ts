import type { Type } from '@nestjs/common'
import { ValidatorException } from '@vivy-common/core'
import { ValidationPipe } from '@vivy-common/core/lib/pipes/validation.pipe.js'
import { describe, expect, it } from 'vitest'
import { CreateModelDto, ListModelDto, UpdateModelDto } from './model.dto.js'

function transform<T>(metatype: Type<T>, value: Record<string, unknown>, type: 'body' | 'query' = 'body'): Promise<T> {
  return ValidationPipe.transform(value, { metatype, type })
}

const payload = {
  provider: 'openai',
  vendor: 'fixture',
  modelName: '测试模型',
  modelCode: 'fixture-model',
  baseUrl: 'https://fixture.example/v1',
  secretKey: 'sk-fixture-secret',
}

describe('AI model request validation', () => {
  it('excludes client-supplied identity and audit fields', async () => {
    const model = await transform(CreateModelDto, {
      ...payload,
      id: 'client-id',
      createBy: 'client-user',
      updateBy: 'client-user',
    })
    expect(model).toMatchObject({
      provider: 'openai',
      vendor: 'fixture',
      modelName: '测试模型',
      modelCode: 'fixture-model',
      baseUrl: 'https://fixture.example/v1',
      secretKey: 'sk-fixture-secret',
    })
    for (const field of ['id', 'createBy', 'updateBy']) {
      expect(model).not.toHaveProperty(field)
    }
    expect(model.status).toBeUndefined()
  })

  it('uses default optional-field semantics and validates supplied values', async () => {
    const model = await transform(UpdateModelDto, { modelName: '新名称', status: null })
    expect(model.modelName).toBe('新名称')
    expect(model.secretKey).toBeUndefined()
    expect(model.status).toBeNull()
    expect((await transform(UpdateModelDto, { secretKey: null })).secretKey).toBeNull()
    await expect(transform(CreateModelDto, { ...payload, secretKey: null })).rejects.toBeInstanceOf(ValidatorException)
    for (const invalid of [
      { secretKey: '' },
      { secretKey: '   ' },
      { secretKey: 'sk fixture' },
      { status: '2' },
      { provider: 'unknown' },
      { baseUrl: 'file:///tmp/example' },
    ]) {
      await expect(transform(UpdateModelDto, invalid)).rejects.toBeInstanceOf(ValidatorException)
    }
  })

  it('reuses project pagination and allows declared search filters', async () => {
    const query = await transform(ListModelDto, { page: '2', limit: '20', provider: 'deepseek', status: '0' }, 'query')
    expect(query).toMatchObject({ page: 2, limit: 20, provider: 'deepseek', status: '0' })
    const filters = await transform(ListModelDto, { search: '测试', extra: 'ignored' }, 'query')
    expect(filters).toMatchObject({
      page: 1,
      limit: 10,
      search: '测试',
    })
    expect(filters).not.toHaveProperty('extra')
    for (const invalid of [{ limit: '0' }, { page: '0' }, { limit: 'not-a-number' }]) {
      await expect(transform(ListModelDto, invalid, 'query')).rejects.toBeInstanceOf(ValidatorException)
    }
  })
})
