import { Button } from '@chakra-ui/react'
import { setProductImageTestMode, useProductImageTestMode } from './productImageTestMode.js'

export const ProductImageTestToggle = () => {
  const isEnabled = useProductImageTestMode()

  if (!import.meta.env.DEV) return null

  return (
    <Button
      position="fixed"
      right="4"
      bottom="20"
      zIndex="1000"
      colorPalette={ isEnabled ? 'red' : 'gray' }
      onClick={ () => setProductImageTestMode(!isEnabled) }
    >
      상품 이미지 오류 테스트 { isEnabled ? '끄기' : '켜기' }
    </Button>
  )
}
