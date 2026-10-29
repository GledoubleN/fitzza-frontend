import { useRef } from 'react'
import { Box, Button, Heading, Text, VStack, Grid } from '@chakra-ui/react'
import { OnboardingStepLayout } from './OnboardingStepLayout.jsx'

const topSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const bottomSizes = [
  '24', '25', '26', '27', '28', '29', '30', '32', '34', '36', '38'
]

export function ClothingSizeStep ({ formData, onFieldChange, onSkip, errorMessage, onPrev, onNext }) {
  const bottomSectionRef = useRef(null)

  const handleTopSelect = (size) => {
    onFieldChange('topSize', size)
    if (bottomSectionRef.current) {
      bottomSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleBottomSelect = (size) => {
    onFieldChange('weightSize', size)
  }

  return (
    <OnboardingStepLayout
      step={ 2 }
      onSkip={ onSkip }
      errorMessage={ errorMessage }
      actions={ (
        <Grid templateColumns="minmax(0, 1fr) minmax(0, 3fr)" gap={ 4 }>
          <Button variant="outline" size="md" onClick={ onPrev }>
            이전
          </Button>
          <Button colorPalette="primary" size="md" onClick={ onNext }>다음</Button>
        </Grid>
      ) }
    >
      <Box mb={ 8 }>
        <Heading mb={ 4 }>
          평소 자주 입는 사이즈는?
        </Heading>
        <Text fontSize="sm" color="fg.muted">상의와 하의 평소 착용 치수를 선택해주세요</Text>
      </Box>

      {/* 💡 mb={ 12 }를 추가하여 하단 '다음' 버튼과의 간격을 넉넉히 확보합니다 */}
      <VStack gap={ 8 } align="stretch" mb={ 12 }>
        <VStack align="stretch" gap={ 4 }>
          {/* 상의 선택 영역 */}
          <VStack align="stretch" gap={ 4 }>
            <Heading fontSize="md">상의</Heading>
            <Grid templateColumns={ { base: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' } } gap={ 4 }>
              { topSizes.map((size) => {
                const isSelected = formData.topSize === size
                return (
                  <Button
                    key={ size }
                    size="md"
                    variant="outline"
                    layerStyle={ isSelected ? 'glass' : undefined }
                    borderColor={ isSelected ? 'fg' : undefined }
                    fontWeight={ isSelected ? 'bold' : undefined }
                    onClick={ () => handleTopSelect(size) }
                  >
                    { size }
                  </Button>
                )
              }) }
            </Grid>
          </VStack>

          {/* 하의 선택 영역 */}
          <VStack ref={ bottomSectionRef } align="stretch" gap={ 4 } pt={ 4 }>
            <Heading fontSize="md">하의</Heading>
            <Grid templateColumns={ { base: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' } } gap={ 4 }>
              { bottomSizes.map((size) => {
                const isSelected = formData.weightSize === size
                return (
                  <Button
                    key={ size }
                    size="md"
                    variant="outline"
                    layerStyle={ isSelected ? 'glass' : undefined }
                    borderColor={ isSelected ? 'fg' : undefined }
                    fontWeight={ isSelected ? 'bold' : undefined }
                    onClick={ () => handleBottomSelect(size) }
                  >
                    { size }
                  </Button>
                )
              }) }
            </Grid>
          </VStack>
        </VStack>
      </VStack>
    </OnboardingStepLayout>
  )
}