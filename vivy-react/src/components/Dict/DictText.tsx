import { memo } from 'react'
import { DictKeys, DictData, convertKeys } from '@/models/dict'

type DictProps = {
  value: DictKeys
  options: DictData[]
  separator?: string
}

const DictText: React.FC<DictProps> = ({ value, options, separator = ',' }) => {
  const data = options.filter((i) => {
    return convertKeys(value).includes(i.dictValue)
  })

  return <span>{data.map((d) => d.dictLabel).join(separator)}</span>
}

export default memo(DictText)
