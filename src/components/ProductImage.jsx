import { useEffect, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { LuCameraOff } from 'react-icons/lu'

export const ProductImage = ({ src, objectFit, onError, ...props }) => {
  const source = typeof src === 'string' ? src.trim() : ''
  const [failedSource, setFailedSource] = useState(null)
  const isFallback = !source || failedSource === source

  useEffect(() => {
    setFailedSource(null)
  }, [source])

  if (isFallback) {
    return (
      <Flex
        {...props}
        aspectRatio="3 / 4"
        direction="column"
        align="center"
        justify="center"
        gap={2}
        bg="bg.muted"
        color="fg.muted"
        rounded="l2"
      >
        <LuCameraOff size={28} />
        <Text textStyle="xs">이미지 준비 중입니다</Text>
      </Flex>
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
