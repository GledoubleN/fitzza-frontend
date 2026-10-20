import { Box, Button, Grid, Heading, Text, Input, InputGroup, VStack } from '@chakra-ui/react'
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
        <Heading mb={ 4 }>신체 정보를 알려주세요</Heading>
        <Text fontSize="sm" color="fg.muted">정확한 AI 사이즈 추천과 비교에 사용돼요</Text>
      </Box>

      <VStack gap={ 4 } align="stretch">

        <VStack align="stretch">
          <Heading fontSize="sm" color="fg.subtle">키</Heading>
          <InputGroup endAddon="cm" endAddonProps={ { color: 'fg.subtle', textAlign: 'center', width: '48px', justifyContent: 'center' } }>
            <Input
              name="height"
              placeholder="178"
              value={ formData.height }
              onChange={ handleNumberChange }
              onKeyDown={ handleKeyDown }
              maxLength={ 3 }
              autoComplete="off"
              size="md"
            />
          </InputGroup>
        </VStack>

        <VStack align="stretch">
          <Heading fontSize="sm" color="fg.subtle">몸무게</Heading>
          <InputGroup endAddon="kg" endAddonProps={ { color: 'fg.subtle', textAlign: 'center', width: '48px', justifyContent: 'center' } }>
            <Input
              name="weight"
              placeholder="75"
              value={ formData.weight }
              onChange={ handleNumberChange }
              onKeyDown={ handleKeyDown }
              maxLength={ 3 }
              autoComplete="off"
              size="md"
            />
          </InputGroup>
        </VStack>

        <VStack align="stretch">
          <Heading fontSize="sm" color="fg.subtle">발사이즈</Heading>
          <InputGroup endAddon="mm" endAddonProps={ { color: 'fg.subtle', textAlign: 'center', width: '48px', justifyContent: 'center' } }>
            <Input
              name="shoeSize"
              placeholder="280"
              value={ formData.shoeSize }
              onChange={ handleNumberChange }
              onKeyDown={ handleKeyDown }
              maxLength={ 3 }
              autoComplete="off"
              size="md"
            />
          </InputGroup>
        </VStack>

      </VStack>
    </OnboardingStepLayout>
  )
}
