import { useEffect, useState } from 'react'
import { Image } from '@chakra-ui/react'
import { ImageFallback } from './ImageFallback.jsx'

export const ProductImage = ({ src, objectFit, onError, ...props }) => {
  const source = typeof src === 'string' ? src.trim() : ''
  const [failedSource, setFailedSource] = useState(null)
  const isFallback = !source || failedSource === source

  useEffect(() => {
    setFailedSource(null)
  }, [source])

  if (isFallback) {
    return (
      <ImageFallback { ...props }/>
    )
  }

  return (
    <Image
      { ...props }
      src={ source }
      objectFit={ objectFit }
      onError={ (event) => {
        if (!isFallback) {
          setFailedSource(source)
        }
        onError?.(event)
      } }
    />
  )
}