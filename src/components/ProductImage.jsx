import { useEffect, useState } from 'react'
import { Image } from '@chakra-ui/react'
import { useProductImageTestMode } from './productImageTestMode.js'

const productImagePlaceholder = '/product-image-placeholder.png'
const testImageSource = '/__broken-product-image-test__.png'

export const ProductImage = ({ src, objectFit, onError, ...props }) => {
  const isTestMode = useProductImageTestMode()
  const originalSource = typeof src === 'string' ? src.trim() : ''
  const source = isTestMode ? testImageSource : originalSource
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
