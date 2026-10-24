import { useSyncExternalStore } from 'react'

const storageKey = 'fitzza-test-broken-product-images'
const changeEvent = 'fitzza-product-image-test-mode-change'

const subscribe = (onChange) => {
  window.addEventListener(changeEvent, onChange)
  return () => window.removeEventListener(changeEvent, onChange)
}

const getSnapshot = () => import.meta.env.DEV && window.sessionStorage.getItem(storageKey) === 'true'

export const useProductImageTestMode = () => useSyncExternalStore(subscribe, getSnapshot, () => false)

export const setProductImageTestMode = (enabled) => {
  if (!import.meta.env.DEV) return

  window.sessionStorage.setItem(storageKey, String(enabled))
  window.dispatchEvent(new Event(changeEvent))
}
