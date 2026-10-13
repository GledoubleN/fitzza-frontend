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
        <Heading size="lg" fontWeight="bold" mb={ 2 }>평소 자주 입는
          사이즈는?</Heading>
        <Text fontSize="sm" color="fg.muted">상의와 하의 평소 착용 치수를 선택해주세요</Text>
      </Box>
      <VStack gap={ 6 } align="stretch">
        <VStack align="stretch" gap={ 4 }>
          <VStack align="stretch" gap={ 2.5 }>
            <Text fontSize="sm" color="fg.muted">상의</Text>
            <Wrap gap={ 2.5 }>
              { topSizes.map((size) => {
                const isSelected = formData.topSize === size
                return (
                  <WrapItem key={ size }>
                    <Button
                      size="md"
                      px={ 5 }
                      py={ 5 }
                      variant={ isSelected ? 'solid' : 'outline' }
                      bg={ isSelected ? 'bg.inverted' : 'bg' }
                      color={ isSelected ? 'fg.inverted' : 'fg' }
                      borderColor={ isSelected ? 'bg.inverted' : 'border' }
                      _hover={ { bg: isSelected ? 'bg.inverted' : 'bg.subtle' } }
                      onClick={ () => onFieldChange('topSize', size) }
                    >
                      { size }
                    </Button>
                  </WrapItem>
                )
              }) }
            </Wrap>
          </VStack>

          <VStack align="stretch" gap={ 2.5 } pt={ 2 }>
            <Text fontSize="sm" color="fg.muted">하의</Text>
            <Wrap gap={ 2.5 }>
              { bottomSizes.map((size) => {
                const isSelected = formData.weightSize === size
                return (
                  <WrapItem key={ size }>
                    <Button
                      size="md"
                      px={ 5 }
                      py={ 5 }
                      variant={ isSelected ? 'solid' : 'outline' }
                      bg={ isSelected ? 'bg.inverted' : 'bg' }
                      color={ isSelected ? 'fg.inverted' : 'fg' }
                      borderColor={ isSelected ? 'bg.inverted' : 'border' }
                      _hover={ { bg: isSelected ? 'bg.inverted' : 'bg.subtle' } }
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
