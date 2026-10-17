import { Box, Button, Container, Flex, Progress, Text } from '@chakra-ui/react'

export function OnboardingStepLayout ({ step, onSkip, errorMessage, actions, children }) {
  return (
    <Container
      maxW={ { base: 'md', md: 'lg' } }
      py={ { base: 6, md: 12 } }
      bg="bg"
      minH="100vh"
      display="flex"
      flexDirection="column"
      position="relative"
    >
      <Box flexShrink={ 0 }>
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
      </Box>

      <Box flex="1" pb={ 16 }>
        { children }
        { errorMessage && (
          <Text color="fg.error" fontSize="sm" mt={ 4 } textAlign="center">
            { errorMessage }
          </Text>
        ) }
      </Box>

      <Box flexShrink={ 0 } pt={ 4 } bg="bg">
        { actions }
      </Box>
    </Container>
  )
}