import React,{ useCallback } from 'react';

function useKeydownCenter(callback?: () => void){
    React.useEffect(() => {
        document.addEventListener('keydown', ctrlCenter)
        return () => {
            document.removeEventListener('keydown', ctrlCenter)
        }
    }, [])
    const ctrlCenter = useCallback((e: any) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          callback?.()
        }
      }, [])
}

export default useKeydownCenter;
