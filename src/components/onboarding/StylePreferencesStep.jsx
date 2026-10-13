import { Box, Button, Heading, Text, VStack, HStack, Wrap, WrapItem } from '@chakra-ui/react'

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

export function StylePreferencesStep ({ formData, onFieldChange }) {
  return (
    <>
      <Box mb={ 8 }>
        <Heading size="lg" fontWeight="bold" mb={ 4 }>체형과 선호하는 스타일을
          골라주세요</Heading>
        <Text fontSize="sm" color="fg.muted">고객님께 딱 맞는 핏과 스타일을 추천해드려요</Text>
      </Box>
      <VStack gap={ 8 } align="stretch">
        <VStack align="stretch" gap={ 4 }>
          <Text fontSize="md" fontWeight="bold" color="fg">체형</Text>
          <Wrap gap={ 4 }>
            { bodyTypeOptions.map((item) => {
              const isSelected = formData.bodyType === item.value
              return (
                <WrapItem key={ item.value }>
                  <Button
                    size="md"
                    px={ 4 }
                    py={ 4 }
                    variant={ isSelected ? 'solid' : 'outline' }
                    bg={ isSelected ? 'bg.inverted' : 'bg' }
                    color={ isSelected ? 'fg.inverted' : 'fg' }
                    borderColor={ isSelected ? 'bg.inverted' : 'border' }
                    _hover={ { bg: isSelected ? 'bg.inverted' : 'bg.subtle' } }
                    onClick={ () => onFieldChange('bodyType', item.value) }
                  >
                    { item.label }
                  </Button>
                </WrapItem>
              )
            }) }
          </Wrap>
        </VStack>

        <VStack align="stretch" gap={ 4 }>
          <Text fontSize="md" fontWeight="bold" color="fg">선호 핏</Text>
          <HStack gap={ 4 }>
            { fitOptions.map((item) => {
              const isSelected = formData.preferredFit === item.value
              return (
                <Button
                  key={ item.value }
                  flex={ 1 }
                  size="md"
                  py={ 4 }
                  variant={ isSelected ? 'solid' : 'outline' }
                  bg={ isSelected ? 'bg.inverted' : 'bg' }
                  color={ isSelected ? 'fg.inverted' : 'fg' }
                  borderColor={ isSelected ? 'bg.inverted' : 'border' }
                  _hover={ { bg: isSelected ? 'bg.inverted' : 'bg.subtle' } }
                  onClick={ () => onFieldChange('preferredFit', item.value) }
                >
                  { item.label }
                </Button>
              )
            }) }
          </HStack>
        </VStack>

        <VStack align="stretch" gap={ 4 }>
          <Text fontSize="md" fontWeight="bold" color="fg">선호
            스타일</Text>
          <Wrap gap={ 4 }>
            { styleOptions.map((item) => {
              const isSelected = formData.style === item.value
              return (
                <WrapItem key={ item.value }>
                  <Button
                    size="md"
                    px={ 4 }
                    py={ 4 }
                    variant={ isSelected ? 'solid' : 'outline' }
                    bg={ isSelected ? 'bg.inverted' : 'bg' }
                    color={ isSelected ? 'fg.inverted' : 'fg' }
                    borderColor={ isSelected ? 'bg.inverted' : 'border' }
                    _hover={ { bg: isSelected ? 'bg.inverted' : 'bg.subtle' } }
                    onClick={ () => onFieldChange('style', item.value) }
                  >
                    { item.label }
                  </Button>
                </WrapItem>
              )
            }) }
          </Wrap>
        </VStack>
      </VStack>
    </>
  )
}
