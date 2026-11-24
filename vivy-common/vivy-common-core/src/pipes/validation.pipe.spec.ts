import { HttpStatus } from '@nestjs/common'
import type { ArgumentMetadata } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsInt, IsString, Min, MinLength } from 'class-validator'
import { describe, expect, it } from 'vitest'
import { ValidatorException } from '../exceptions/validator.exception.js'
import { ValidationPipe } from './validation.pipe.js'

class TestDto {
  @Type(() => Number)
  @IsInt({ message: 'id must be an integer' })
  @Min(1, { message: 'id must be positive' })
  id: number

  @IsString()
  @MinLength(2, { message: 'name must have at least two characters' })
  name: string
}

const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto }

describe('ValidationPipe', () => {
  it('transforms DTO values and removes properties outside the whitelist', async () => {
    const result = await ValidationPipe.transform({ id: '2', name: 'admin', extra: 'ignored' }, metadata)

    expect(result).toBeInstanceOf(TestDto)
    expect(result).toEqual({ id: 2, name: 'admin' })
  })

  it('returns the first validation error as a business validation exception', async () => {
    const result = ValidationPipe.transform({ id: 0, name: 'x' }, metadata)

    await expect(result).rejects.toBeInstanceOf(ValidatorException)
    await expect(result).rejects.toMatchObject({
      code: HttpStatus.BAD_REQUEST,
      message: 'id must be positive',
    })
  })
})
