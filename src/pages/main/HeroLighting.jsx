import { chakra } from '@chakra-ui/react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTime, useTransform } from 'motion/react'
import { useEffect } from 'react'

const MotionBox = chakra(motion.div)

const LIGHTS = [
  { color: 'pantone.cloudDancer', centerX: '50%', centerY: '38%', size: '44vmax', period: 7200, drift: 16, follow: 20 },
  { color: 'pantone.raindropsOnRoses', centerX: '40%', centerY: '32%', size: '30vmax', period: 5200, drift: 24, follow: 40 },
  { color: 'pantone.iceMelt', centerX: '60%', centerY: '34%', size: '30vmax', period: 6400, drift: 24, follow: -30 },
  { color: 'pantone.lemonIcing', centerX: '50%', centerY: '26%', size: '24vmax', period: 4600, drift: 16, follow: 60 },
  { color: 'pantone.peachDust', centerX: '42%', centerY: '46%', size: '28vmax', period: 5600, drift: 20, follow: 30 },
  { color: 'pantone.orchidTint', centerX: '58%', centerY: '46%', size: '28vmax', period: 6000, drift: 20, follow: -20 },
  { color: 'pantone.almostAqua', centerX: '50%', centerY: '52%', size: '24vmax', period: 5000, drift: 16, follow: 40 },
]

const INTENSITY = { light: '0.55', dark: '0.2' }

const MOUSE_SPRING = { stiffness: 140, damping: 24 }

const useMousePosition = () => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const onPointerMove = (event) => {
      x.set(event.clientX / window.innerWidth * 2 - 1)
      y.set(event.clientY / window.innerHeight * 2 - 1)
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [x, y])

  return {
    x: useSpring(x, MOUSE_SPRING),
    y: useSpring(y, MOUSE_SPRING),
  }
}

const Light = ({ light, index, time, mouse, isStill }) => {
  const motionScale = isStill ? 0 : 1

  const x = useTransform(() => (Math.sin(time.get() / light.period + index) * light.drift + mouse.x.get() * light.follow) * motionScale)
  const y = useTransform(() => (Math.cos(time.get() / (light.period * 1.3) + index) * light.drift + mouse.y.get() * light.follow) * motionScale)

  return (
    <MotionBox
      position="absolute"
      top={ `calc(${ light.centerY } - ${ light.size } / 2)` }
      left={ `calc(${ light.centerX } - ${ light.size } / 2)` }
      width={ light.size }
      height={ light.size }
      rounded="full"
      bgImage={ `radial-gradient(circle, {colors.${ light.color }} 30%, transparent 70%)` }
      opacity={ { base: INTENSITY.light, _dark: INTENSITY.dark } }
      filter="auto"
      blur="3xl"
      saturate="160%"
      style={ { x, y } }
    />
  )
}

export const HeroLighting = ({ progress }) => {
  const isStill = useReducedMotion()
  const time = useTime()
  const mouse = useMousePosition()
  const opacity = useTransform(progress, [0, 0.5], [1, 0])
  const scale = useTransform(progress, [0, 0.5], [1, 1.4])

  return (
    <MotionBox
      position="fixed"
      inset="0"
      zIndex="hide"
      pointerEvents="none"
      style={ { opacity, scale } }
    >
      {
        LIGHTS.map((light, index) => (
          <Light
            key={ light.color }
            light={ light }
            index={ index }
            time={ time }
            mouse={ mouse }
            isStill={ isStill }
          />
        ))
      }
    </MotionBox>
  )
}
