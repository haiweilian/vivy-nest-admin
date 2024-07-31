/**
 * @name 代理的配置
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  '/api/': {
    target: 'http://localhost:9200',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
  '/uploads/': {
    target: 'http://localhost:9200',
    changeOrigin: true,
  },
}
