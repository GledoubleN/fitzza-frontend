import { Box, chakra, Flex, Icon, Text } from '@chakra-ui/react'
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { AIPromptCard } from '../../components/AIPromptCard.jsx'
import { Logo } from '../../components/Logo.jsx'
import { LOGO_TEXT_PROPS } from './logoTextProps.js'
import { useMeasure } from './useMeasure.js'

const MotionBox = chakra(motion.div)

const toRect = (element) => ({
  left: element.offsetLeft,
  top: element.offsetTop,
  width: element.offsetWidth,
  height: element.offsetHeight,
})

const toViewportRect = (element) => {
  const { left, top, width, height } = element.getBoundingClientRect()
  return { left, top, width, height }
}

const toTransform = (x, y, scale = 1) => `translate(${ x }px, ${ y }px) scale(${ scale })`

const toOffsetTransform = (from, to, scale) => toTransform(to.left - from.left, to.top - from.top, scale)

const RESTING_TRANSFORM = toTransform(0, 0)

const DOCK_FROM_PROGRESS = 0.4

const UNDOCK_BELOW_PROGRESS = 0.35

const DOCK_TRANSITION = { duration: 0.7, ease: 'easeInOut' }

const INSTANT_TRANSITION = { duration: 0 }

export const MainHero = ({ progress, logoSlotRef, promptSlotRef }) => {
  const logoRef = useRef(null)
  const promptAnchorRef = useRef(null)
  const [rects, setRects] = useState(null)
  const [isDocked, setIsDocked] = useState(false)
  const isStill = useReducedMotion()
  const dockTransition = isStill ? INSTANT_TRANSITION : DOCK_TRANSITION

  useMeasure(() => {
    if (!logoRef.current || !logoSlotRef.current || !promptSlotRef.current) return

    setRects({
      logo: toRect(logoRef.current),
      logoSlot: toViewportRect(logoSlotRef.current),
      prompt: toRect(promptAnchorRef.current),
      promptSlot: toViewportRect(promptSlotRef.current),
    })
  })

  useMotionValueEvent(progress, 'change', (value) => {
    setIsDocked((wasDocked) => wasDocked ? value > UNDOCK_BELOW_PROGRESS : value > DOCK_FROM_PROGRESS)
  })

  const isMoved = rects !== null && isDocked
  const logoTransform = isMoved
    ? toOffsetTransform(rects.logo, rects.logoSlot, rects.logoSlot.width / rects.logo.width)
    : RESTING_TRANSFORM
  const promptTransform = isMoved
    ? toOffsetTransform(rects.prompt, rects.promptSlot)
    : RESTING_TRANSFORM
  const promptWidth = rects === null ? '100%' : isDocked ? rects.promptSlot.width : rects.prompt.width

  const introOpacity = useTransform(progress, [0, 0.25], [1, 0])

  return (
    <MotionBox
      position="fixed"
      top="0"
      insetX="0"
      height="100svh"
      zIndex="banner"
      pointerEvents="none"
    >
      <Flex
        position="absolute"
        inset="0"
        direction="column"
        align="center"
        justify="center"
        gap={ 8 }
        paddingX={ 4 }
        paddingBottom="12vh"
      >
        <MotionBox
          ref={ logoRef }
          initial={ false }
          animate={ { transform: logoTransform } }
          transition={ dockTransition }
          style={ { transformOrigin: '0 0' } }
          pointerEvents="auto"
        >
          <Text
            as="h1"
            { ...LOGO_TEXT_PROPS }
            fontSize={ { base: '7xl', md: '9xl' } }
          >
            <chakra.button
              cursor="pointer"
              onClick={ () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
            >
              <Logo/>
            </chakra.button>
          </Text>
        </MotionBox>

        <Box
          ref={ promptAnchorRef }
          position="relative"
          width="full"
          maxWidth="2xl"
          height="12"
        >
          <MotionBox
            position="absolute"
            top="0"
            left="0"
            initial={ false }
            animate={ { transform: promptTransform, width: promptWidth } }
            transition={ dockTransition }
            pointerEvents="auto"
          >
            <AIPromptCard hasShadow={ !isDocked }/>
          </MotionBox>
        </Box>
      </Flex>

      <MotionBox
        position="absolute"
        bottom="28"
        left="0"
        right="0"
        style={ { opacity: introOpacity } }
      >
        <Flex
          direction="column"
          align="center"
          gap={ 1 }
          color="fg.subtle"
          animation="bounce"
          animationDuration="2s"
        >
          <Text textStyle="xs">스크롤해서 맞춤 추천 열어보기</Text>
          <Icon as={ LuChevronDown }/>
        </Flex>
      </MotionBox>
    </MotionBox>
  )
}
