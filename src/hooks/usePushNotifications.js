import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import { enablePush, isPushConfigured } from '../services/pushNotifications.js'

export const usePushNotifications = (isSignedIn) => {
  const [error, setError] = useState('')
  const [previousSignedIn, setPreviousSignedIn] = useState(isSignedIn)
  const session = useRef(0)
  const registerPush = useRef(null)

  if (previousSignedIn !== isSignedIn) {
    setPreviousSignedIn(isSignedIn)
    setError('')
  }

  useEffect(() => {
    const currentSession = ++session.current

    if (!isSignedIn || !isPushConfigured) return

    let registering = false
    let registeredToken

    const registerPushToken = async (requestPermission = false) => {
      if (registering || session.current !== currentSession) return

      registering = true

      try {
        const token = await enablePush({ requestPermission })

        if (!token || session.current !== currentSession) return
        if (token === registeredToken) return

        await api.post('/notifications/tokens', { token })
        registeredToken = token

        if (session.current === currentSession) setError('')
      } catch (cause) {
        if (session.current === currentSession) {
          setError(cause.message || '알림을 활성화하지 못했습니다.')
        }
      } finally {
        registering = false
      }
    }

    registerPush.current = registerPushToken

    const handleFocus = () => {
      if ('Notification' in window && Notification.permission === 'granted') void registerPushToken()
    }

    window.addEventListener('focus', handleFocus)
    handleFocus()

    return () => {
      registerPush.current = null
      session.current = currentSession + 1
      window.removeEventListener('focus', handleFocus)
    }
  }, [isSignedIn])

  return {
    requestPushPermission: () => registerPush.current?.(true),
    error,
    isConfigured: isPushConfigured,
  }
}