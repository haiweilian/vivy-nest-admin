# 文件上传

本地文件存储服务。可在(系统工具 -> 文件上传)中管理文件。

## 配置

在配置文件中配置上传信息。

```yaml
# vivy-modules/vivy-system/src/config/config.yaml
upload:
  path: ${{ PWD }}/uploads
  prefix: /uploads
  # domain: http://localhost:${{ app.port }}
```

把上传的文件作为静态文件响应。

```ts
// vivy-modules/vivy-system/src/main.ts
async function bootstrap() {
  // ...
  app.useStaticAssets(config.get('upload.path'), { prefix: config.get('upload.prefix') })
  // ...
}
```

## 装饰器

通过指定的装饰器获取文件访问地址。

### @UploadFileUrl()

```ts
import { UploadFileUrl } from '../upload/upload.decorator'
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadFileUrl() url: string): Promise<AjaxResult> {
    console.log(url)
    // '/uploads/1723965589601fc7229032d084cf4a39ad492507bbe51.png'
  }
}
```

### @UploadFileUrls()

```ts
import { UploadFileUrls } from '../upload/upload.decorator'
export class FileController {
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadFileUrls() urls: string[]): Promise<AjaxResult> {
    console.log(urls)
    // [
    //   '/uploads/1723965589601fc7229032d084cf4a39ad492507bbe51.png',
    //   '/uploads/1723797787911ce4b6fe1c4c848189e0ca5330f607b65.png'
    // ]
  }
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system/src/modules/file
