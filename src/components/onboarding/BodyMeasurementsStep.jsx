import { Box, Button, Grid, Heading, Text, Input, InputGroup, VStack, HStack } from '@chakra-ui/react'
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
        <Heading mb={ 4 }>키와 몸무게를
          알려주세요</Heading>
        <Text fontSize="sm" color="fg.muted">정확한 AI 사이즈 추천과 비교에 사용돼요</Text>
      </Box>
      <VStack gap={ 8 } align="stretch">
        <VStack align="stretch" gap={ 4 }>
          <Heading fontSize="md">
            키 · 몸무게 (숫자만 입력)
          </Heading>
          <HStack gap={ 4 }>
            <InputGroup flex={ 1 } endAddon="cm" endAddonProps={ { color: 'fg.subtle' } }>
              <Input
                name="height"
                placeholder="175"
                value={ formData.height }
                onChange={ handleNumberChange }
                onKeyDown={ handleKeyDown }
                maxLength={ 3 }
                autoComplete="off"
                size="md"
              />
            </InputGroup>

            <InputGroup flex={ 1 } endAddon="kg" endAddonProps={ { color: 'fg.subtle' } }>
              <Input
                name="weight"
                placeholder="65"
                value={ formData.weight }
                onChange={ handleNumberChange }
                onKeyDown={ handleKeyDown }
                maxLength={ 3 }
                autoComplete="off"
                size="md"
              />
            </InputGroup>
          </HStack>
          <Text fontSize="xs" color="fg.subtle">
            * 키(130~200cm), 몸무게(30~120kg) 범위 내로 입력해주세요.
          </Text>
        </VStack>
      </VStack>
    </OnboardingStepLayout>
  )
}
