import { Box, Button, Heading, Text, VStack, Grid } from '@chakra-ui/react'
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx'
import { OnboardingSaveConfirmation } from './OnboardingSaveConfirmation.jsx'

const bodyTypeOptions = [
  { label: '마른편 (슬림)', value: '마른편' },
  { label: '보통 (스탠다드)', value: '보통' },
  { label: '근육질 (탄탄함)', value: '근육질' },
  { label: '통통한편 (체격 있음)', value: '통통한편' },
]

const fitOptions = [
  { label: '슬림 핏', value: '슬림' },
  { label: '레귤러 핏', value: '레귤러' },
  { label: '오버사이즈', value: '오버사이즈' },
]

const styleOptions = [
  { label: '캐주얼', value: '캐주얼' },
  { label: '스트릿', value: '스트릿' },
  { label: '미니멀', value: '미니멀' },
  { label: '포멀 / 비즈니스', value: '포멀' },
]

export function StylePreferencesStep ({ formData, onFieldChange, onSkip, errorMessage, onPrev, onSave, isLoading, isSaved, onConfirm }) {
  return (
    <OnboardingStepLayout
      step={ 3 }
      onSkip={ onSkip }
      errorMessage={ errorMessage }
      actions={ (
        <Grid templateColumns="minmax(0, 1fr) minmax(0, 3fr)" gap={ 4 }>
          <Button variant="outline" size="md" onClick={ onPrev }>
            이전
          </Button>
          <Button colorPalette="primary" size="md" loading={ isLoading } loadingText="저장 중..." onClick={ onSave }>
            저장하기
          </Button>
        </Grid>
      ) }
    >
      <Box mb={ 4 }>
        <Heading mb={ 1 }>
          체형과 선호하는 스타일을 골라주세요
        </Heading>
        <Text fontSize="sm" color="fg.muted">고객님께 딱 맞는 핏과 스타일을 추천해드려요</Text>
      </Box>

      <VStack gap={ 6 } align="stretch">
        <VStack align="stretch" gap={ 3 }>
          <Heading fontSize="md">체형</Heading>
          <Grid templateColumns={ { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } } gap={ 3 }>
            { bodyTypeOptions.map((item) => {
              const isSelected = formData.bodyType === item.value
              return (
                <Button
                  key={ item.value }
                  size="md"
                  variant={ isSelected ? 'solid' : 'outline' }
                  onClick={ () => onFieldChange('bodyType', item.value) }
                >
                  { item.label }
                </Button>
              )
            }) }
          </Grid>
        </VStack>

        <VStack align="stretch" gap={ 3 }>
          <Heading fontSize="md">
            선호 핏
          </Heading>
          <Grid templateColumns={ { base: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } } gap={ 3 }>
            { fitOptions.map((item) => {
              const isSelected = formData.preferredFit === item.value
              return (
                <Button
                  key={ item.value }
                  size="md"
                  variant={ isSelected ? 'solid' : 'outline' }
                  onClick={ () => onFieldChange('preferredFit', item.value) }
                >
                  { item.label }
                </Button>
              )
            }) }
          </Grid>
        </VStack>

        <VStack align="stretch" gap={ 3 }>
          <Heading fontSize="md">
            선호 스타일
          </Heading>
          <Grid templateColumns={ { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } } gap={ 3 }>
            { styleOptions.map((item) => {
              const isSelected = formData.style === item.value
              return (
                <Button
                  key={ item.value }
                  size="md"
                  variant={ isSelected ? 'solid' : 'outline' }
                  onClick={ () => onFieldChange('style', item.value) }
                >
                  { item.label }
                </Button>
              )
            }) }
          </Grid>
        </VStack>
      </VStack>
      { isSaved && <OnboardingSaveConfirmation onConfirm={ onConfirm } /> }
    </OnboardingStepLayout>
  )
}