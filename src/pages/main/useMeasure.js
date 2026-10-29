import { useEffect, useEffectEvent } from 'react'

export const useMeasure = (measure, trigger) => {
  const onMeasure = useEffectEvent(measure)

  useEffect(() => {
    onMeasure()

    const resizeObserver = new ResizeObserver(() => onMeasure())
    resizeObserver.observe(document.body)
    document.fonts?.ready.then(() => onMeasure())

    return () => resizeObserver.disconnect()
  }, [trigger])
}
