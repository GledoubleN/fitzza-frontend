import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../contexts/AuthContext.js'
import { RequireSignIn } from './RequireSignIn.jsx'

export const RequireAdmin = ({ children }) => {
  const { accessToken, isSignedIn } = useAuth()
  const [permission, setPermission] = useState(null)

  useEffect(() => {
    if (!isSignedIn) return

    const controller = new AbortController()

    api.get('/users/me', { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setPermission({ accessToken, isAdmin: data?.role === 'ADMIN' })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPermission({ accessToken, isAdmin: false })
        }
      })

    return () => controller.abort()
  }, [accessToken, isSignedIn])

  if (!isSignedIn) return <RequireSignIn>{ children }</RequireSignIn>
  if (permission?.accessToken !== accessToken) return null
  if (!permission.isAdmin) return <Navigate to="/" replace/>

  return children
}