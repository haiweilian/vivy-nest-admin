import { defineConfig } from '@umijs/max';

export default defineConfig({
  /**
   * @name 配置全局变量
   * @description 设置代码中的可用变量。
   * @doc https://umijs.org/docs/api/config#define
   */
  define: {
    BASE_URL: '/api',
  },
});
