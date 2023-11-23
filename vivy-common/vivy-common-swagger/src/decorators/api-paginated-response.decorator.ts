import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger'

// nestjs-typeorm-paginate IPaginationMeta
class PaginationMeta {
  /**
   * the amount of items on this specific page
   */
  @ApiProperty()
  itemCount: number

  /**
   * the total amount of items
   */
  @ApiProperty()
  totalItems?: number

  /**
   * the amount of items that were requested per page
   */
  @ApiProperty()
  itemsPerPage: number

  /**
   * the total amount of pages in this paginator
   */
  @ApiProperty()
  totalPages?: number

  /**
   * the current page this paginator "points" to
   */
  @ApiProperty()
  currentPage: number
}

// nestjs-typeorm-paginate IPaginationLinks
class PaginationLinks {
  /**
   * a link to the "first" page
   */
  @ApiProperty()
  first?: string

  /**
   * a link to the "previous" page
   */
  @ApiProperty()
  previous?: string

  /**
   * a link to the "next" page
   */
  @ApiProperty()
  next?: string

  /**
   * a link to the "last" page
   */
  @ApiProperty()
  last?: string
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(PaginationMeta),
    ApiExtraModels(PaginationLinks),
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                $ref: getSchemaPath(PaginationMeta),
              },
              links: {
                type: 'object',
                $ref: getSchemaPath(PaginationLinks),
              },
            },
          },
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
}
