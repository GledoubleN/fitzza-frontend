import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import { enablePush, isPushConfigured } from '../services/pushNotifications.js'

export const usePushNotifications = (isSignedIn) => {
  const [error, setError] = useState('')
  const [previousSignedIn, setPreviousSignedIn] = useState(isSignedIn)
  const session = useRef(0)

  if (previousSignedIn !== isSignedIn) {
    setPreviousSignedIn(isSignedIn)
    setError('')
  }

  useEffect(() => {
    const currentSession = ++session.current

    if (!isSignedIn || !isPushConfigured) return

    let registering = false
    let registeredToken

    const registerPushToken = async () => {
      if (registering || session.current !== currentSession) return

      registering = true

      try {
        const token = await enablePush()

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

    const handleFocus = () => {
      if ('Notification' in window && Notification.permission === 'granted') void registerPushToken()
    }

    window.addEventListener('focus', handleFocus)
    handleFocus()

    return () => {
      session.current = currentSession + 1
      window.removeEventListener('focus', handleFocus)
    }
  }, [isSignedIn])

  return {
    error,
    isConfigured: isPushConfigured,
  }
}