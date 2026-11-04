import { Box, chakra, Flex, Icon, Text } from '@chakra-ui/react'
import { easeInOut, mix, motion, transform, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
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

const useMorph = (rects, docking, pick, fallback) => useTransform(() => {
  const current = rects.get()
  const progress = docking.get()
  return current ? pick(current, progress) : fallback
})

export const MainHero = ({ progress, logoSlotRef, promptSlotRef }) => {
  const logoRef = useRef(null)
  const promptAnchorRef = useRef(null)
  const rects = useMotionValue(null)

  useMeasure(() => {
    if (!logoRef.current || !logoSlotRef.current || !promptSlotRef.current) return

    rects.set({
      logo: toRect(logoRef.current),
      logoSlot: toViewportRect(logoSlotRef.current),
      prompt: toRect(promptAnchorRef.current),
      promptSlot: toViewportRect(promptSlotRef.current),
    })
  })

  const docking = useTransform(progress, (value) => transform(value, [0.05, 0.9], [0, 1], { ease: easeInOut }))
  const [isDocked, setIsDocked] = useState(false)
  useMotionValueEvent(docking, 'change', (value) => setIsDocked(value > 0.9))

  const logoX = useMorph(rects, docking, ({ logo, logoSlot }, k) => mix(0, logoSlot.left - logo.left, k), 0)
  const logoY = useMorph(rects, docking, ({ logo, logoSlot }, k) => mix(0, logoSlot.top - logo.top, k), 0)
  const logoScale = useMorph(rects, docking, ({ logo, logoSlot }, k) => mix(1, logoSlot.width / logo.width, k), 1)

  const promptX = useMorph(rects, docking, ({ prompt, promptSlot }, k) => mix(0, promptSlot.left - prompt.left, k), 0)
  const promptY = useMorph(rects, docking, ({ prompt, promptSlot }, k) => mix(0, promptSlot.top - prompt.top, k), 0)
  const promptWidth = useMorph(rects, docking, ({ prompt, promptSlot }, k) => mix(prompt.width, promptSlot.width, k), '100%')

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
          style={ { x: logoX, y: logoY, scale: logoScale, transformOrigin: '0 0' } }
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
            style={ { x: promptX, y: promptY, width: promptWidth } }
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
