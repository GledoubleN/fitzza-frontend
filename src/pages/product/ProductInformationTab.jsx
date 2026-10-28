import { useState } from 'react'
import { Image, Stack, Text } from '@chakra-ui/react'
import { ImageFallback } from '../../components/ImageFallback.jsx'

const ProductInformationImage = ({ src, alt }) => {
  const source = typeof src === 'string' ? src.trim() : ''
  const [failedSource, setFailedSource] = useState(null)

  if (!source || failedSource === source) {
    return <ImageFallback width={ '100%' }/>
  }

  return (
    <Image
      width={ '100%' }
      src={ source }
      alt={ alt }
      onError={ () => setFailedSource(source) }
    ></Image>
  )
}

export const ProductInformationTab = ({ product }) => {
  return (
    <Stack gap={ 4 } paddingY={ 4 }>
      { product.description?.trim() && (
        <Text whiteSpace={ 'pre-wrap' }>{ product.description }</Text>
      ) }
      { product.images?.map((image) => (
        <ProductInformationImage
          key={ image }
          src={ image }
          alt={ product.productName }
        ></ProductInformationImage>
      )) }
    </Stack>
  )
}