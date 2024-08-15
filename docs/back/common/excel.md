# 导入导出

在实际开发中经常需要使用导入导出功能来加快数据的操作。在项目中可以使用装饰器来完成此项功能。在需要被导入导出的实体类属性添加装饰器。基于 [exceljs](https://github.com/exceljs/exceljs) 封装。

## 装饰器

### @ExcelSheet()

定义工作表属性，继承 `ExcelJS.AddWorksheetOptions` 的所有配置。

```ts
export interface ExcelSheetOption extends Partial<AddWorksheetOptions> {
  /**
   * 工作表名称
   */
  name: string
  /**
   * 行默认高
   */
  rowHeight?: number
  /**
   * 行基础样式，与具体行样式合并
   */
  // rowStyle?: Partial<Style>
  /**
   * 列默认宽
   */
  colWidth?: number
  /**
   * 列基础样式，与具体列样式合并
   */
  colStyle?: Partial<Style>
  /**
   * 表头基础样式，与列样式合并
   */
  headerStyle?: Partial<Style>
}
```

### @ExcelColumn()

定义表格列属性，继承 `ExcelJS.Column` 所有配置。

```ts
export interface ExcelColumnOption extends Partial<Column> {
  /**
   * 列名称
   */
  name: string
  /**
   * 列排序，根据数字正序
   */
  sort?: number
  /**
   * 列类型，根据类型默认转化复杂的操作
   */
  type?: 'link' | 'image'
  /**
   * type="link" 链接配置
   */
  linkOptions?: {
    tooltip?: string
  }
  /**
   * type="image" 图片配置
   */
  imageOptions?: {
    width?: number
    height?: number
    hyperlink?: boolean
  }
  /**
   * 字典类型，当 dictOptions 静态时可选
   */
  dictType?: string
  /**
   * 字典选项
   */
  dictOptions?: {
    label: string
    value: string
  }[]
  /**
   * 默认值，当值为空时使用此值
   */
  defaultValue?: CellValue
  /**
   * 自定义配置，当前列的每个单元格都会调用一次
   */
  cellConfig?(info: {
    row: Row
    cell: Cell
    rawRow: Record<string, any>
    rawCell: Record<string, any>
    rowIndex: number
    cellIndex: number
  }): void
  /**
   * 自定义字段
   */
  [index: string]: unknown
}
```

## 使用装饰器

在需要导入导出的实体上添加装饰器。

```ts
import { ExcelColumn, ExcelSheet } from '@vivy-common/excel'

@ExcelSheet({
  name: '用户信息',
  rowHeight: 30,
  colWidth: 30,
  colStyle: { alignment: { vertical: 'middle' } },
  headerStyle: {
    font: { color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' }, bgColor: { argb: '000000' } },
  },
})
export class SysUser {
  @ExcelColumn({
    name: '用户账号',
  })
  userName: string

  @ExcelColumn({
    name: '用户昵称',
  })
  nickName: string

  @ExcelColumn({
    name: '用户手机',
    width: 30,
    cellConfig({ cell }) {
      if (typeof cell.value === 'string') {
        cell.value = cell.value.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
      }
    },
  })
  phonenumber?: string

  @ExcelColumn({
    name: '用户性别',
    dictType: 'sys_user_sex',
    dictOptions: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
      { label: '保密', value: '3' },
    ],
  })
  sex: string

  @ExcelColumn({
    name: '用户头像',
    type: 'image',
    imageOptions: {
      width: 30,
      height: 30,
      hyperlink: true,
    },
  })
  avatar?: string
}
```

## 导出实现流程

前端通过 `file-saver` 下载文件。

```ts
import { saveAs } from 'file-saver'

// 定义请求
function exportUserList() {
  return request(`/user/export`, {
    method: RequestEnum.GET,
    responseType: 'blob',
    getResponse: true,
  })
}

// 调用请求
exportUserList().then(({ data }) => {
  saveAs(data, `用户列表.xlsx`)
})
```

后端返回生成的文件流。

```ts
import { Controller, Get, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ExcelService } from '@vivy-common/excel'
import { SysUser } from './entities/sys-user.entity'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private excelService: ExcelService
  ) {}

  /**
   * 导出用户
   */
  @Get('export')
  async export() {
    const data = await this.userService.find()
    const file = await this.excelService.export(SysUser, data)
    return new StreamableFile(file)
  }

  /**
   * 导出模板
   */
  @Get('export/template')
  async exportTemplate() {
    const file = await this.excelService.exportTemplate(SysUser, {
      exclude: ['sex', 'avatar'],
    })
    return new StreamableFile(file)
  }
}
```

## 导入实现流程

前端获取文件内容上传。

```ts
import { Button, UploadFile } from 'antd'

// 定义请求
function importUserList(data: FormData) {
  return request(`/user/import`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  })
}

// 提交表单
async function handleSubmit(values: { files: UploadFile[] }) {
  const data = new FormData()
  data.set('file', values.files[0].originFileObj!)
  await importUserList(data)
}
```

后端获取到文件内容解析出数据。

```ts
import { Controller, Get, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ExcelService } from '@vivy-common/excel'
import { SysUser } from './entities/sys-user.entity'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private excelService: ExcelService
  ) {}

  /**
   * 导入用户
   */
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    const data = await this.excelService.import(SysUser, file.buffer)
    await this.userService.insert(data)
  }
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-excel

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system/src/modules/system/user
