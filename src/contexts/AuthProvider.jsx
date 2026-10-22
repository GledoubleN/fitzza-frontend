import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios.js'

import { AuthContext } from './AuthContext.js'

const AUTH_URLS = ['/auth/signin', '/auth/refresh']

let restoringAccessToken = null

const restoreAccessToken = () => {
  restoringAccessToken ??= api.post('/auth/refresh')
    .then(({ data }) => data?.accessToken ?? null)
    .catch(() => null)
    .finally(() => {
      restoringAccessToken = null
    })

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
      async (error) => {
        const { config, response } = error
        const sentToken = config?.headers?.Authorization
        if (response?.status !== 401 || !sentToken || config.retried || AUTH_URLS.includes(config.url)) {
          return Promise.reject(error)
        }

        const token = response.data?.code === 'TOKEN_EXPIRED' ? await restoreAccessToken() : null
        setAccessToken(token)
        config.retried = true
        if (token) {
          config.headers.Authorization = `Bearer ${ token }`
        } else {
          delete config.headers.Authorization
        }
        return api(config)
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
