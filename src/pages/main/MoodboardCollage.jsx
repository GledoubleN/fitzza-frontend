import { Box, chakra, useBreakpointValue } from '@chakra-ui/react'
import { motion, useMotionValueEvent, useTransform } from 'motion/react'
import { useState } from 'react'
import { ProductItem } from '../../components/ProductItem.jsx'

const MotionBox = chakra(motion.div)

const DESKTOP_PIECES = [
  { x: 0.1, y: 0.2, width: '10vw', rotate: 7 },
  { x: 0.15, y: 0.44, width: '14vw', rotate: -5, isFeatured: true },
  { x: 0.07, y: 0.66, width: '11vw', rotate: 4 },
  { x: 0.2, y: 0.76, width: '9vw', rotate: -8 },
  { x: 0.88, y: 0.2, width: '9vw', rotate: -6 },
  { x: 0.85, y: 0.44, width: '14vw', rotate: 4, isFeatured: true },
  { x: 0.93, y: 0.64, width: '10vw', rotate: -3 },
  { x: 0.79, y: 0.76, width: '11vw', rotate: 7 },
]

const MOBILE_PIECES = [
  { x: 0.2, y: 0.2, width: '26vw', rotate: -7 },
  { x: 0.5, y: 0.2, width: '30vw', rotate: 3, isFeatured: true },
  { x: 0.8, y: 0.21, width: '25vw', rotate: 8 },
  { x: 0.22, y: 0.7, width: '26vw', rotate: 6 },
  { x: 0.52, y: 0.69, width: '28vw', rotate: -4, isFeatured: true },
  { x: 0.8, y: 0.71, width: '24vw', rotate: -8 },
]

const HIDDEN_FROM_PROGRESS = 0.3

const Polaroid = ({ product, piece, isInteractive }) => (
  <Box
    position="absolute"
    left={ `${ piece.x * 100 }%` }
    top={ `${ piece.y * 100 }%` }
    width={ piece.width }
    translate="-50% -50%"
    rotate={ `${ piece.rotate }deg` }
    zIndex={ piece.isFeatured ? 2 : 1 }
    pointerEvents={ isInteractive ? 'auto' : 'none' }
    inert={ !isInteractive }
    filter="auto"
    blur="sm"
    transition="rotate 0.25s ease, scale 0.25s ease, filter 0.25s ease"
    _hover={ { rotate: '0deg', scale: '1.05', zIndex: 3, blur: '0' } }
  >
    <ProductItem product={ product }/>
  </Box>
)

export const MoodboardCollage = ({ products, progress }) => {
  const pieces = useBreakpointValue({ base: MOBILE_PIECES, md: DESKTOP_PIECES }) ?? []
  const [isInteractive, setIsInteractive] = useState(true)

  useMotionValueEvent(progress, 'change', (value) => setIsInteractive(value < HIDDEN_FROM_PROGRESS))

  const opacity = useTransform(progress, [0, HIDDEN_FROM_PROGRESS], [1, 0])
  const y = useTransform(progress, [0, HIDDEN_FROM_PROGRESS], [0, -48])

  return (
    <MotionBox
      position="fixed"
      inset="0"
      zIndex="base"
      pointerEvents="none"
      style={ { opacity, y } }
    >
      {
        pieces.slice(0, products.length).map((piece, index) => (
          <Polaroid
            key={ products[index].productId }
            product={ products[index] }
            piece={ piece }
            isInteractive={ isInteractive }
          />
        ))
      }
    </MotionBox>
  )
}
