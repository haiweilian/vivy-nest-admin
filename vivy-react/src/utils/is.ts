import { isNull, isUndefined } from 'lodash-es'

export const isNullOrUndef = (val: unknown): val is null | undefined => {
  return isNull(val) || isUndefined(val)
}
