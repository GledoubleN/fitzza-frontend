import { createContext, useContext } from 'react'

export const PushNotificationContext = createContext(null)

export const usePushNotification = () => {
  const context = useContext(PushNotificationContext)

  if (!context) {
    throw new Error('usePushNotification must be used within PushNotificationProvider')
  }

  return context
}