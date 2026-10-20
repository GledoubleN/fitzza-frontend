import { initializeApp } from 'firebase/app'
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from 'firebase/messaging'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

export const isPushConfigured = Boolean(
  config.apiKey &&
  config.projectId &&
  config.messagingSenderId &&
  config.appId &&
  vapidKey,
)

let messagingPromise

const loadMessaging = () => {
  messagingPromise ??= isSupported().then((supported) => {
    if (!supported) throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.')

    return getMessaging(initializeApp(config, 'push-notifications'))
  })

  return messagingPromise
}

const registerMessagingWorker = () => {
  const workerUrl = new URL(
    `${ import.meta.env.BASE_URL }firebase-messaging-sw.js`,
    window.location.origin)

  workerUrl.searchParams.set('config', JSON.stringify(config))

  return navigator.serviceWorker.register(workerUrl, {
    scope: `${ import.meta.env.BASE_URL }firebase-cloud-messaging-push-scope/`,
  })
}

export const subscribeToPush = async (receive) => {
  const messaging = await loadMessaging()

  return onMessage(messaging, receive)
}

let pendingRegistration
let disablingPush = false

const registerPush = async () => {
  if (!isPushConfigured) throw new Error('푸시 알림 설정이 필요합니다.')
  if (!('Notification' in window)) throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.')

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission

  if (permission !== 'granted') return null

  const messaging = await loadMessaging()
  const serviceWorkerRegistration = await registerMessagingWorker()

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration,
  })

  if (!token) throw new Error('알림 등록 토큰을 발급받지 못했습니다.')

  return token
}

export const enablePush = () => {
  if (disablingPush) return Promise.resolve(null)

  pendingRegistration ??= registerPush().finally(() => {
    pendingRegistration = undefined
  })

  return pendingRegistration
}

export const disablePush = async () => {
  if (!isPushConfigured || !('serviceWorker' in navigator)) return

  disablingPush = true

  try {
    await pendingRegistration?.catch(() => {})

    const registration = await navigator.serviceWorker.getRegistration(
      `${ import.meta.env.BASE_URL }firebase-cloud-messaging-push-scope/`,
    )

    if (!registration) return

    const messaging = await loadMessaging()

    await deleteToken(messaging)

    const subscription = await registration.pushManager.getSubscription()

    if (subscription && !await subscription.unsubscribe()) {
      throw new Error('푸시 알림 구독을 해제하지 못했습니다.')
    }
  } finally {
    disablingPush = false
  }
}