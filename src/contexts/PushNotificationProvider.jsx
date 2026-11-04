import { useMemo } from 'react'
import { useAuth } from './AuthContext.js'
import { PushNotificationContext } from './PushNotificationContext.js'
import { usePushTokenRegistration } from '../hooks/usePushTokenRegistration.js'

export const PushNotificationProvider = ({ children }) => {
  const { isSignedIn } = useAuth()
  const { error, isConfigured } = usePushTokenRegistration(isSignedIn)
  const value = useMemo(() => ({ error, isConfigured }), [error, isConfigured])

  return <PushNotificationContext.Provider value={ value }>{ children }</PushNotificationContext.Provider>
}