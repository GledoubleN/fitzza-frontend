import { useEffect, useState } from 'react'
import { Image } from '@chakra-ui/react'

const productImagePlaceholder = '/product-image-placeholder.png'

export const ProductImage = ({ src, objectFit, onError, ...props }) => {
  const source = typeof src === 'string' ? src.trim() : ''
  const [failedSource, setFailedSource] = useState(null)
  const isFallback = !source || failedSource === source

  useEffect(() => {
    setFailedSource(null)
  }, [source])

  return (
    <Image
      { ...props }
      src={ isFallback ? productImagePlaceholder : source }
      objectFit={ isFallback ? 'contain' : objectFit }
      onError={ (event) => {
        if (!isFallback) {
          setFailedSource(source)
        }
        onError?.(event)
      } }
    />
  )
}
