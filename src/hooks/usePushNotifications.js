import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import {
  enablePush,
  isPushConfigured,
  subscribeToPush,
} from '../services/pushNotifications.js'

const notificationLimit = 50

export const usePushNotifications = (isSignedIn) => {
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')
  const [previousSignedIn, setPreviousSignedIn] = useState(isSignedIn)
  const session = useRef(0)

  if (previousSignedIn !== isSignedIn) {
    setPreviousSignedIn(isSignedIn)
    setNotifications([])
    setError('')
  }

  useEffect(() => {
    const currentSession = ++session.current

    if (!isSignedIn || !isPushConfigured) return

    let unsubscribe
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
      if (Notification.permission === 'granted') void registerPushToken()
    }

    const handleMessage = (payload) => {
      if (session.current !== currentSession) return

      const title = payload.notification?.title || payload.data?.title
      const body = payload.notification?.body || payload.data?.body

      if (!title && !body) return

      const notification = {
        id: payload.messageId || crypto.randomUUID(),
        title: title || '알림',
        body,
      }

      setNotifications((previous) => {
        const isDuplicate = previous.some((item) => item.id === notification.id)

        if (isDuplicate) return previous

        return [notification, ...previous].slice(0, notificationLimit)
      })
    }

    subscribeToPush(handleMessage).then((cleanup) => {
      if (session.current !== currentSession) cleanup()
      else {
        unsubscribe = cleanup
        window.addEventListener('focus', handleFocus)
        void registerPushToken()
      }
    }).catch(() => {
      if (session.current === currentSession) setError('푸시 알림을 연결하지 못했습니다.')
    })

    return () => {
      session.current = currentSession + 1
      unsubscribe?.()
      window.removeEventListener('focus', handleFocus)
    }
  }, [isSignedIn])

  return {
    notifications,
    error,
    isConfigured: isPushConfigured,
  }
}