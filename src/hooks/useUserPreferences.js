import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'

export const useUserPreferences = () => {
  const [attempt, setAttempt] = useState(0)
  const [preferences, setPreferences] = useState({
    preferredFits: [],
    preferredStyles: [],
    isFailed: false,
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
        isFailed: false,
      })
    }).catch(() => {
      if (controller.signal.aborted) return

      setPreferences((prev) => ({ ...prev, isFailed: true }))
    })

    return () => controller.abort()
  }, [attempt])

  const reload = () => setAttempt((count) => count + 1)

  return { ...preferences, reload }
}
