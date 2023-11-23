import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { isArray } from 'lodash'

type TModel = Type<any> | NumberConstructor | StringConstructor | BooleanConstructor

export const ApiDataResponse = (model: TModel | TModel[]) => {
  const decorators = []
  let data: SchemaObject | ReferenceObject

  if (model === Number) {
    data = {
      type: 'number',
    }
  } else if (model === String) {
    data = {
      type: 'string',
    }
  } else if (model === Boolean) {
    data = {
      type: 'boolean',
    }
  } else if (isArray(model)) {
    if (model[0] === Number) {
      data = {
        type: 'array',
        items: {
          type: 'number',
        },
      }
    } else if (model[0] === String) {
      data = {
        type: 'array',
        items: {
          type: 'string',
        },
      }
    } else if (model[0] === Boolean) {
      data = {
        type: 'array',
        items: {
          type: 'boolean',
        },
      }
    } else {
      data = {
        type: 'array',
        items: {
          $ref: getSchemaPath(model[0]),
        },
      }
      decorators.push(ApiExtraModels(model[0]))
    }
  } else {
    data = {
      $ref: getSchemaPath(model),
    }
    decorators.push(ApiExtraModels(model))
  }

  decorators.push(
    ApiOkResponse({
      schema: {
        properties: {
          data,
          code: {
            type: 'number',
            default: 200,
          },
          message: {
            type: 'string',
            default: '操作成功',
          },
        },
      },
    })
  )

  return applyDecorators(...decorators)
}
