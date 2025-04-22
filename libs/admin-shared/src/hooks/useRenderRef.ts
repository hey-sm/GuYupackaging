import { useState, useRef } from 'react'

interface RenderRef<T> {
  readonly current: T
}

export default function useRenderRef<T = undefined>(init?: T): [RenderRef<T | undefined>, (data?: T) => void] {
  const [refState, setState] = useState<T | undefined>(init)
  const ref = useRef<T | undefined>(init)
  const res: RenderRef<T | undefined> = {
    get current() {
      return ref.current
    },
  }
  const change = (data?: T) => {
    ref.current = data
    setState(data)
  }
  return [res, change]
}
