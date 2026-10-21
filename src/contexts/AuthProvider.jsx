import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios.js'

import { AuthContext } from './AuthContext.js'

export const AuthProvider = ({ children }) => {
  const [accessToken, setToken] = useState(null)

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
        if (error.response?.status === 401 && error.config?.url !== '/auth/signin') {
          setAccessToken(null)
          window.location.href = '/signin'
        }
        return Promise.reject(error)
      },
    )

    return () => api.interceptors.response.eject(interceptor)
  }, [setAccessToken])

  const value = useMemo(() => ({
    accessToken,
    setAccessToken,
    isSignedIn: !!accessToken,
  }), [accessToken, setAccessToken])

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>
}
