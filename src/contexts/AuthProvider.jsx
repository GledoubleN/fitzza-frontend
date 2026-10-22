import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios.js'

import { AuthContext } from './AuthContext.js'

const UNAUTHORIZED_REDIRECT_EXCLUDED_URLS = ['/auth/signin', '/auth/refresh']

let restoringAccessToken = null

const restoreAccessToken = () => {
  restoringAccessToken ??= api.post('/auth/refresh')
    .then(({ data }) => data?.accessToken ?? null)
    .catch(() => null)

  return restoringAccessToken
}

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(null)
  const [isRestoring, setIsRestoring] = useState(true)

  const setAccessToken = useCallback((token) => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${ token }`
    } else {
      delete api.defaults.headers.common.Authorization
    }
    setToken(token)
  }, [])

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !UNAUTHORIZED_REDIRECT_EXCLUDED_URLS.includes(error.config?.url)) {
          setAccessToken(null)
          window.location.href = '/signin'
        }
        return Promise.reject(error)
      },
    )

    return () => api.interceptors.response.eject(interceptor)
  }, [setAccessToken])

  useEffect(() => {
    restoreAccessToken().then((token) => {
      setAccessToken(token)
      setIsRestoring(false)
    })
  }, [setAccessToken])

  const value = useMemo(() => ({
    accessToken,
    setAccessToken,
    isSignedIn: !!accessToken,
  }), [accessToken, setAccessToken])

  if (isRestoring) return null

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>
}
