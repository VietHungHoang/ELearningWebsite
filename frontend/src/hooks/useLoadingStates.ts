import { useState, useCallback } from 'react'

interface LoadingStates {
  [key: string]: boolean
}

export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({})

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading)
  }, [loadingStates])

  const clearLoading = useCallback((key?: string) => {
    if (key) {
      setLoadingStates(prev => {
        const newState = { ...prev }
        delete newState[key]
        return newState
      })
    } else {
      setLoadingStates({})
    }
  }, [])

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
    loadingStates
  }
}

export default useLoadingStates
