import { isPushConfigured, subscribeToPush } from '../../services/pushNotifications.js'

export const listenForPush = (types, targetId) => {
  let arrived = false
  let wake = null
  let closed = false
  let unsubscribe = null

  if (isPushConfigured) {
    subscribeToPush(({ data }) => {
      if (!types.includes(data?.type) || data?.targetId !== String(targetId)) return
      arrived = true
      wake?.(true)
    }).then((cleanup) => {
      if (closed) cleanup()
      else unsubscribe = cleanup
    }).catch(() => {})
  }

  const wakeOnFocus = () => wake?.(true)
  window.addEventListener('focus', wakeOnFocus)

  const wait = (timeout) => new Promise((resolve) => {
    if (arrived) {
      arrived = false
      resolve(true)
      return
    }
    const timer = setTimeout(() => wake(false), timeout)
    wake = (shouldCheck) => {
      clearTimeout(timer)
      wake = null
      arrived = false
      resolve(shouldCheck)
    }
  })

  const close = () => {
    closed = true
    wake?.(false)
    unsubscribe?.()
    window.removeEventListener('focus', wakeOnFocus)
  }

  return { wait, close }
}
