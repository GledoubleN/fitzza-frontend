import { useRef } from 'react'
import { Box, Button, Heading, Text, VStack, Grid } from '@chakra-ui/react'
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx'
import { OnboardingSaveConfirmation } from './OnboardingSaveConfirmation.jsx'
import { useUserPreferences } from '../../hooks/useUserPreferences.js'

export function StylePreferencesStep ({ formData, onFieldChange, onSkip, errorMessage, onPrev, onSave, isLoading, isSaved, onConfirm }) {
  const styleSectionRef = useRef(null)
  const { preferredFits, preferredStyles, errorMessage: preferencesError } = useUserPreferences()
  const fitOptions = [{ label: '선택 안함', value: '' }, ...preferredFits]
  const styleOptions = [{ label: '선택 안함', value: '' }, ...preferredStyles]

  const handleFitSelect = (value) => {
    onFieldChange('preferredFit', value)
    if (styleSectionRef.current) {
      styleSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleStyleSelect = (value) => {
    onFieldChange('style', value)
  }

  return (
    <OnboardingStepLayout
      step={ 3 }
      onSkip={ onSkip }
      errorMessage={ errorMessage || preferencesError }
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
          선호하는 스타일을 골라주세요
        </Heading>
        <Text fontSize="sm" color="fg.muted">고객님께 딱 맞는 핏과 스타일을 추천해드려요</Text>
      </Box>

      {/* 💡 mb={ 12 }를 추가하여 하단 '저장하기' 버튼과의 간격을 넉넉히 확보합니다 */}
      <VStack gap={ 6 } align="stretch" mb={ 12 }>
        {/* 선호 핏 영역 */}
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
                  onClick={ () => handleFitSelect(item.value) }
                >
                  { item.label }
                </Button>
              )
            }) }
          </Grid>
        </VStack>

        {/* 선호 스타일 영역 */}
        <VStack ref={ styleSectionRef } align="stretch" gap={ 3 }>
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
                  onClick={ () => handleStyleSelect(item.value) }
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