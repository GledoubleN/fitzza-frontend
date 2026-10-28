import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { isPushConfigured, subscribeToPush } from '../services/pushNotifications.js'

const pageSize = 5

export const toNotificationPath = ({ type, targetId }) => {
  switch (type) {
    case 'FITTING_DONE':
      return `/ai-stylist/fittings/${ targetId }`
    case 'RECOMMENDATION_DONE':
      return `/ai-stylist/${ targetId }`
    case 'COMMENT':
    case 'VOTE_CLOSED':
      return `/community/articles/${ targetId }`
    default:
      return null
  }
}

export const toNotificationText = ({ type, content }) => (
  type === 'FITTING_FAILED' ? '요청하신 가상 피팅이 실패했어요.' : content
)

const showSystemNotification = ({ notification, data }) => {
  if (!notification || Notification.permission !== 'granted') return

  try {
    new Notification(notification.title || 'FITZZA', {
      body: toNotificationText({ type: data?.type, content: notification.body }),
      tag: data?.notificationId,
    })
  } catch {
    return
  }
}

export const useNotifications = (isSignedIn) => {
  const [notifications, setNotifications] = useState([])
  const [status, setStatus] = useState('idle')
  const [previousSignedIn, setPreviousSignedIn] = useState(isSignedIn)

  if (previousSignedIn !== isSignedIn) {
    setPreviousSignedIn(isSignedIn)
    setNotifications([])
    setStatus('idle')
  }

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const { data } = await api.get('/notifications', { params: { page: 0, size: pageSize } })
      setNotifications(data.content)
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }, [])

  useEffect(() => {
    if (!isSignedIn) return

    load()
    window.addEventListener('focus', load)

    let unsubscribe
    let cancelled = false

    if (isPushConfigured) {
      subscribeToPush((payload) => {
        showSystemNotification(payload)
        load()
      }).then((cleanup) => {
        if (cancelled) cleanup()
        else unsubscribe = cleanup
      }).catch(() => {})
    }

    return () => {
      cancelled = true
      unsubscribe?.()
      window.removeEventListener('focus', load)
    }
  }, [isSignedIn, load])

  const markAsRead = async (notificationId) => {
    setNotifications((notifications) => notifications.map((notification) => (
      notification.notificationId === notificationId ? { ...notification, isRead: true } : notification
    )))
    await api.patch(`/notifications/${ notificationId }`).catch(() => {})
  }

  return {
    notifications,
    status,
    hasUnread: notifications.some((notification) => !notification.isRead),
    reload: load,
    markAsRead,
  }
}