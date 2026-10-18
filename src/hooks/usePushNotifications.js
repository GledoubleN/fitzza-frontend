import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import {
  enablePush,
  isPushConfigured,
  subscribeToPush,
} from '../services/pushNotifications.js'

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
    const register = async () => {
      if (registering || session.current !== currentSession) return
      registering = true
      try {
        const token = await enablePush()
        if (!token || session.current !== currentSession) return
        if (token === registeredToken) return
        const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT
        if (!endpoint) throw new Error('알림 토큰 등록 API 설정이 필요합니다.')
        await api.post(endpoint, { token })
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
      if (Notification.permission === 'granted') void register()
    }
    const receive = (payload) => {
      if (session.current !== currentSession) return
      const title = payload.notification?.title || payload.data?.title
      const body = payload.notification?.body || payload.data?.body
      if (!title && !body) return
      const notification = {
        id: payload.messageId || crypto.randomUUID(),
        title: title || '알림',
        body,
      }
      setNotifications(
        (previous) => previous.some((item) => item.id === notification.id)
          ? previous
          : [notification, ...previous].slice(0, 50))
    }
    subscribeToPush(receive).then((cleanup) => {
      if (session.current !== currentSession) cleanup()
      else {
        unsubscribe = cleanup
        window.addEventListener('focus', handleFocus)
        void register()
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

  return { notifications, error, isConfigured: isPushConfigured }
}