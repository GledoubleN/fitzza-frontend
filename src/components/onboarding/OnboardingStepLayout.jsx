import { Box, Button, Container, Flex, Progress, Text } from '@chakra-ui/react'
import { useMotionValue } from 'motion/react'
import { HeroLighting } from '../../pages/main/HeroLighting.jsx'

export function OnboardingStepLayout ({ step, onSkip, errorMessage, actions, children }) {
  const lightingProgress = useMotionValue(0)

  return (
    <Container
      maxW={ { base: 'md', md: 'lg' } }
      py={ 12 }
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      <HeroLighting progress={ lightingProgress }/>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={ 4 }>
          <Text fontSize="sm" fontWeight="bold" color="fg.subtle">
            STEP { step } / 3
          </Text>
          <Button variant="ghost" size="md" onClick={ onSkip }>
            건너뛰기
          </Button>
        </Flex>
        <Progress.Root value={ (step / 3) * 100 } size="xs" mb={ 8 }>
          <Progress.Track bg="bg.muted">
            <Progress.Range bg="bg.inverted" />
          </Progress.Track>
        </Progress.Root>
        { children }
        { errorMessage && (
          <Text color="fg.error" fontSize="sm" mt={ 4 } textAlign="center">
            { errorMessage }
          </Text>
        ) }
      </Box>
      { actions }
    </Container>
  )
}
