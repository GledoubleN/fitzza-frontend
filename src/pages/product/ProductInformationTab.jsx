import { Image, Stack, Text } from '@chakra-ui/react'

export const ProductInformationTab = ({ product }) => {
  return (
    <Stack gap={ 4 } paddingY={ 4 }>
      { product.description?.trim() && (
        <Text whiteSpace={ 'pre-wrap' }>{ product.description }</Text>
      ) }
      { product.images?.map((image) => (
        <Image key={ image } width={ '100%' } src={ image } alt={ product.productName }></Image>
      )) }
    </Stack>
  )
}
