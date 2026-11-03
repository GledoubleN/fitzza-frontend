import { chakra } from '@chakra-ui/react'

export const Logo = () => (
  <>
    F
    <chakra.span
      display="inline-block"
      lineHeight="1"
      bgImage="linear-gradient(to bottom, {colors.terracotta.solid} 36%, {colors.fg} 36%)"
      bgClip="text"
      color="transparent"
    >
      i
    </chakra.span>
    TZZA
  </>
)
