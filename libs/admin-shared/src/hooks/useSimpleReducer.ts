import { useCallback, useState } from 'react'

declare type DispatchAction<T> = (vals: Partial<T>) => void
declare type ResetAction<T> = (vals?: T) => void

export default function useSimpleReducer<T>(initVals: T): [T, DispatchAction<T>, ResetAction<T>] {
  const [values, setValues] = useState(initVals)

  const reset = useCallback((vals?: T) => setValues(vals || initVals), [])
  const dispatch = useCallback((vals: Partial<T>) => setValues((v) => ({ ...v, ...vals })), [])

  return [values, dispatch, reset]
}
