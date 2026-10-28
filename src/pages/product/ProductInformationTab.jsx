import { Stack, Text } from '@chakra-ui/react'
import { ProductImage } from '../../components/ProductImage.jsx'

export const ProductInformationTab = ({ product }) => {
  return (
    <Stack gap={ 4 } paddingY={ 4 }>
      { product.description?.trim() && (
        <Text whiteSpace={ 'pre-wrap' }>{ product.description }</Text>
      ) }
      { product.images?.map((image) => (
        <ProductImage
          key={ image }
          width={ '100%' }
          src={ image }
          alt={ product.productName }
        ></ProductImage>
      )) }
    </Stack>
  )
}