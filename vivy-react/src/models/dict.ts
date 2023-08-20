import { useMap } from 'ahooks'
import { isArray } from 'lodash-es'
import { useCallback } from 'react'
import { getDictDataList } from '@/apis/system/dict-data'
import type { DictDataModel } from '@/apis/system/dict-data'
import { isNullOrUndef } from '@/utils/is'

export type DictKeys = number | number[] | string | string[]
export type DictData = DictDataModel & {
  label: string
  value: string
}

const cache = new Set<DictType>()

export const convertKeys = (keys?: DictKeys) => {
  if (isNullOrUndef(keys)) return []
  if (isArray(keys)) {
    return keys.map((k) => k.toString())
  } else {
    return [keys.toString()]
  }
}

export const getDictData = async (type: DictType) => {
  return getDictDataList(type).then((data) => {
    return (data as DictData[]).map((item) => {
      item.label = item.dictLabel
      item.value = item.dictValue
      return item
    })
  })
}

export default () => {
  const [dict, actions] = useMap<DictType, DictData[]>()

  /**
   * 加载字典列表
   * @param type 字典类型
   */
  const loadDict = (type: DictType) => {
    if (!cache.has(type)) {
      cache.add(type)
      getDictData(type)
        .then((data) => {
          cache.add(type)
          actions.set(type, data)
        })
        .catch(() => {
          cache.delete(type)
        })
    }

    return actions.get(type) || []
  }

  /**
   * 重新加载字典
   * @param type 字典类型
   */
  const reloadDict = (type: DictType) => {
    cache.delete(type)
    loadDict(type)
    return actions.get(type) || []
  }

  /**
   * 转化为下拉选项
   */
  const toSelect = (data: DictData[]) => {
    return data.filter((i) => i.status === '0')
  }

  /**
   * 转化为枚举选项
   */
  const toMapEnum = (data: DictData[]) => {
    return new Map(toSelect(data).map((i) => [i.value, i.label]))
  }

  return {
    dict,
    loadDict: useCallback(loadDict, [dict]),
    reloadDict: useCallback(reloadDict, []),
    toSelect: useCallback(toSelect, []),
    toMapEnum: useCallback(toMapEnum, []),
  }
}
