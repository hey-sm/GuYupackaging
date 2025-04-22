import qs from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router'

function useQuery<T extends Record<string, string>>() {
  const location = useLocation()

  const query = useMemo<T>(() => {
    const queryStr = location.search?.replace('?', '') || ''
    const q = qs.parse(queryStr)
    return q as T
  }, [])

  return query
}

export default useQuery