# 文件上传

文件存储服务。可在(系统工具 -> 文件上传)中管理文件。

## 配置

### 本地上传

在配置文件中配置上传信息。

```yaml
# vivy-modules/vivy-system/src/config/config.yaml
upload:
  path: ${{ PWD }}/uploads
  prefix: /uploads
  domain: http://localhost:${{ app.port }}
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

### OSS上传

在配置文件中配置 OSS 上传信息。

```yaml
# vivy-modules/vivy-system/src/config/config.yaml
uploadOss:
  region: oss-cn-beijing
  bucket: vivy-nest-admin
  accessKeyId: ${{ ACCESS_KEY_ID }}
  accessKeySecret: ${{ ACCESS_KEY_SECRET }}
  authorizationV4: true
  domain: https://vivy-nest-admin.oss-cn-beijing.aliyuncs.com
```

自定义存储实现，改为 OSS 存储。

```ts
// vivy-modules/vivy-system/src/modules/file/file.module.ts
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        storage: multerOssStorage(config.get<UploadOssOptions>('uploadOss')),
      }),
      inject: [ConfigService],
    }),
  ]
})
```

## 拦截器

使用 Multer 插件上传，默认只支持 multipart/form-data 格式。但有时我们只能接收别的格式，比如 base64 编码图片。
我们需要先把 base64 编码的图片转为 Multer 支持的格式，这样后续的上传流程和逻辑就可以不用改变。

### Base64FileInterceptor

把 base64 转为 multipart/form-data 格式。

```ts
@Controller('files')
export class FileController {
  @Post('upload-base64')
  @UseInterceptors(Base64FileInterceptor, FileInterceptor('file'))
  async uploadBase64(@UploadedFile() file: Express.Multer.File, @UploadFileUrl() url: string): Promise<AjaxResult> {
    console.log(url, file)
    return AjaxResult.success(url)
  }
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
