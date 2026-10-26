import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    preferredFits: [],
    preferredStyles: [],
    errorMessage: '',
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
        errorMessage: '',
      })
    }).catch(() => {
      if (controller.signal.aborted) return

      setPreferences({
        preferredFits: [],
        preferredStyles: [],
        errorMessage: '선호 핏과 스타일을 불러오지 못했어요.',
      })
    })

    return () => controller.abort()
  }, [])

  return preferences
}