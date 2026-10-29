import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    preferredFits: [],
    preferredStyles: [],
  })

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      api.get('/users/preferences/fits', { signal: controller.signal }),
      api.get('/users/preferences/styles', { signal: controller.signal }),
    ]).then(([fits, styles]) => {
      if (controller.signal.aborted) return

      setPreferences({
        preferredFits: fits.data,
        preferredStyles: styles.data,
      })
    }).catch(() => {})

    return () => controller.abort()
  }, [])

  return preferences
}
