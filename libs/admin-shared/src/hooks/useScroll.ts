import { useRef, useEffect, useCallback } from 'react'
import { SpringSystem, Spring } from 'rebound'

type ScrollHandle = (n: number) => void
export type ScrollOptions = {
  to: number
  from?: number
  handle?: ScrollHandle
}

function useScroll(handle?: ScrollHandle) {
  const springRef = useRef<Spring>()
  const handleRef = useRef<ScrollHandle | undefined>(handle)

  useEffect(() => {
    const springSystem = new SpringSystem()
    springRef.current = springSystem.createSpring(50, 10)
    springRef.current.addListener({ onSpringUpdate: handleSpringUpdate })

    return () => {
      springRef.current?.removeAllListeners()
    }
  }, [])

  const handleSpringUpdate = useCallback((spring: Spring) => {
    const val = spring.getCurrentValue()
    handleRef.current?.(val)
  }, [])

  const scrollLeft = ({ from, to, handle }: ScrollOptions) => {
    if (handle) handleRef.current = handle
    springRef.current?.setCurrentValue(from || 0)?.setAtRest()
    springRef.current?.setEndValue(to)
  }

  const scrollTop = ({ from, to, handle }: ScrollOptions) => {
    if (handle) handleRef.current = handle
    springRef.current?.setCurrentValue(from || 0)?.setAtRest()
    springRef.current?.setEndValue(to)
  }

  return { scrollTop, scrollLeft }
}

export default useScroll
