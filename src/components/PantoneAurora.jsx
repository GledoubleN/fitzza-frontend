import { Box, chakra } from '@chakra-ui/react'
import { motion, useReducedMotion } from 'motion/react'

const MotionBox = chakra(motion.div)

const LIGHTS = [
  { color: 'pantone.raindropsOnRoses', top: '10%', left: '5%', path: { x: ['0%', '70%', '-20%'], y: ['0%', '60%', '100%'], scale: [1, 1.3, 0.9] }, duration: 3.5 },
  { color: 'pantone.iceMelt', top: '40%', left: '40%', path: { x: ['0%', '-80%', '20%'], y: ['0%', '-70%', '30%'], scale: [1, 0.8, 1.2] }, duration: 4 },
  { color: 'pantone.lemonIcing', top: '60%', left: '0%', path: { x: ['0%', '60%', '100%'], y: ['0%', '-60%', '-20%'], scale: [1, 1.2, 1] }, duration: 3 },
  { color: 'pantone.orchidTint', top: '0%', left: '50%', path: { x: ['0%', '-60%', '-100%'], y: ['0%', '80%', '30%'], scale: [1, 0.9, 1.3] }, duration: 4.5 },
]

export const PantoneAurora = ({ delay = 0 }) => {
  const isStill = useReducedMotion()

  return (
    <Box
      position={ 'absolute' }
      inset={ '0' }
      overflow={ 'hidden' }
      bg={ 'bg.muted' }
    >
      {
        LIGHTS.map((light) => (
          <MotionBox
            key={ light.color }
            position={ 'absolute' }
            top={ light.top }
            left={ light.left }
            width={ '4/5' }
            aspectRatio={ 1 }
            rounded={ 'full' }
            bg={ light.color }
            filter={ 'auto' }
            blur={ '3xl' }
            animate={ isStill ? undefined : {
              ...light.path,
              transition: { duration: light.duration, delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            } }
          />
        ))
      }
    </Box>
  )
}
