import { history } from '@umijs/max'
import { useEffect } from 'react'

const Redirect: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    history.replace(path)
  }, [])
  return null
}

export { Redirect }
