import { useEffect, useEffectEvent } from 'react'

export const useMeasure = (measure, trigger) => {
  const onMeasure = useEffectEvent(measure)

  useEffect(() => {
    const handleResize = () => onMeasure()
    handleResize()

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.body)
    window.addEventListener('resize', handleResize)
    document.fonts?.ready.then(handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [trigger])
}
