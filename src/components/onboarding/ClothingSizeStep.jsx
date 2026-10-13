import { Box, Button, Heading, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'

const topSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const bottomSizes = [
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '32',
  '34',
  '36',
  '38']

export function ClothingSizeStep ({ formData, onFieldChange }) {
  return (
    <>
      <Box mb={ 8 }>
        <Heading size="lg" fontWeight="bold" mb={ 4 }>평소 자주 입는
          사이즈는?</Heading>
        <Text fontSize="sm" color="fg.muted">상의와 하의 평소 착용 치수를 선택해주세요</Text>
      </Box>
      <VStack gap={ 8 } align="stretch">
        <VStack align="stretch" gap={ 4 }>
          <VStack align="stretch" gap={ 4 }>
            <Text fontSize="sm" color="fg.muted">상의</Text>
            <Wrap gap={ 4 }>
              { topSizes.map((size) => {
                const isSelected = formData.topSize === size
                return (
                  <WrapItem key={ size }>
                    <Button
                      colorPalette="primary"
                      size="md"
                      variant={ isSelected ? 'solid' : 'outline' }
                      onClick={ () => onFieldChange('topSize', size) }
                    >
                      { size }
                    </Button>
                  </WrapItem>
                )
              }) }
            </Wrap>
          </VStack>

          <VStack align="stretch" gap={ 4 } pt={ 4 }>
            <Text fontSize="sm" color="fg.muted">하의</Text>
            <Wrap gap={ 4 }>
              { bottomSizes.map((size) => {
                const isSelected = formData.weightSize === size
                return (
                  <WrapItem key={ size }>
                    <Button
                      colorPalette="primary"
                      size="md"
                      variant={ isSelected ? 'solid' : 'outline' }
                      onClick={ () => onFieldChange('weightSize', size) }
                    >
                      { size }
                    </Button>
                  </WrapItem>
                )
              }) }
            </Wrap>
          </VStack>
        </VStack>
      </VStack>
    </>
  )
}
