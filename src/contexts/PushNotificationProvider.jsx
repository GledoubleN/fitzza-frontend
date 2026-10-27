import { useMemo } from 'react'
import { useAuth } from './AuthContext.js'
import { PushNotificationContext } from './PushNotificationContext.js'
import { usePushNotifications } from '../hooks/usePushNotifications.js'

export const PushNotificationProvider = ({ children }) => {
  const { isSignedIn } = useAuth()
  const { error, isConfigured } = usePushNotifications(isSignedIn)
  const value = useMemo(() => ({ error, isConfigured }), [error, isConfigured])

  return <PushNotificationContext.Provider value={ value }>{ children }</PushNotificationContext.Provider>
}