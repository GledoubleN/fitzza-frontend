import { Flex, Text } from '@chakra-ui/react'
import { LuCameraOff } from 'react-icons/lu'

export const ImageFallback = (props) => {
  return (
    <Flex
      aspectRatio={ '3 / 4' }
      rounded={ 'l2' }
      direction={ 'column' }
      align={ 'center' }
      justify={ 'center' }
      gap={ 4 }
      bg={ 'bg.muted' }
      color={ 'fg.muted' }
      { ...props }
    >
      <LuCameraOff size={ 28 }/>
      <Text textStyle={ 'xs' }>이미지 준비 중입니다</Text>
    </Flex>
  )
}