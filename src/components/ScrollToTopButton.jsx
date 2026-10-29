import { useEffect, useState } from 'react'
import { LuArrowUp } from 'react-icons/lu'
import { FloatingButton } from './FloatingButton.jsx'

export const ScrollToTopButton = ({ threshold = 300, bottom = '28', align = 'flex-end' }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > threshold)

    window.addEventListener('scroll', updateVisibility)
    updateVisibility()

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [threshold])

  if (!isVisible) {
    return null
  }

  return (
    <FloatingButton
      bottom={ bottom }
      align={ align }
      aria-label="맨 위로"
      onClick={ () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
    >
      <LuArrowUp/>
    </FloatingButton>
  )
}
