import { defineConfig } from 'taze'

export default defineConfig({
  mode: 'latest',
  recursive: true,
  exclude: [
    // antd 6 需连同 @ant-design/pro-components 3.x 一起升，而 3.x 至今只有 prerelease，
    'antd',
  ],
  // ropperjs v2 重写为 Web Components 且移除了 CSS，react-cropper 又硬依赖 ^1.5.13，只能跟在 v1 分支上
  packageMode: {
    cropperjs: 'minor',
  },
})
