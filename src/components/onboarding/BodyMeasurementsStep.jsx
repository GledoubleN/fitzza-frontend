import { Box, Button, Grid, Heading, Text, Input, VStack, HStack } from '@chakra-ui/react'
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx'

export function BodyMeasurementsStep ({ formData, onFieldChange, onSkip, errorMessage, onNext }) {
  const handleNumberChange = (e) => {
    const { name, value } = e.target
    onFieldChange(name, value.replace(/[^0-9]/g, ''))
  }

  const handleKeyDown = (e) => {
    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <OnboardingStepLayout
      step={ 1 }
      onSkip={ onSkip }
      errorMessage={ errorMessage }
      actions={ (
        <Grid templateColumns="1fr" gap={ 4 }>
          <Button colorPalette="primary" size="md" onClick={ onNext }>다음</Button>
        </Grid>
      ) }
    >
      <Box mb={ 8 }>
        <Heading size="lg" fontWeight="bold" mb={ 4 }>키와 몸무게를
          알려주세요</Heading>
        <Text fontSize="sm" color="fg.muted">정확한 AI 사이즈 추천과 비교에 사용돼요</Text>
      </Box>
      <VStack gap={ 8 } align="stretch">
        <VStack align="stretch" gap={ 4 }>
          <Text fontSize="md" fontWeight="bold" color="fg">키 · 몸무게
            (숫자만 입력)</Text>
          <HStack gap={ 4 }>
            <Box flex={ 1 } position="relative">
              <Input
                name="height"
                placeholder="175"
                value={ formData.height }
                onChange={ handleNumberChange }
                onKeyDown={ handleKeyDown }
                maxLength={ 3 }
                autoComplete="off"
                pr={ 16 }
                py={ 8 }
              />
              <Box
                position="absolute"
                right={ 4 }
                top="50%"
                transform="translateY(-50%)"
                fontSize="md"
                color="fg.subtle"
                pointerEvents="none"
              >
                cm
              </Box>
            </Box>

            <Box flex={ 1 } position="relative">
              <Input
                name="weight"
                placeholder="65"
                value={ formData.weight }
                onChange={ handleNumberChange }
                onKeyDown={ handleKeyDown }
                maxLength={ 3 }
                autoComplete="off"
                pr={ 16 }
                size="md"
                py={ 8 }
              />
              <Box
                position="absolute"
                right={ 4 }
                top="50%"
                transform="translateY(-50%)"
                fontSize="md"
                color="fg.subtle"
                pointerEvents="none"
              >
                kg
              </Box>
            </Box>
          </HStack>
          <Text fontSize="xs" color="fg.subtle">
            * 키(130~200cm), 몸무게(30~120kg) 범위 내로 입력해주세요.
          </Text>
        </VStack>
      </VStack>
    </OnboardingStepLayout>
  )
}
