import { readFileSync } from 'fs'
import { resolve } from 'path'
import { IApi } from '@umijs/max'

export default (api: IApi) => {
  api.modifyHTML(($) => {
    const loading = readFileSync(resolve(__dirname, './html/loading.html'), 'utf-8')
    $('#root').html(loading)
    return $
  })
}
