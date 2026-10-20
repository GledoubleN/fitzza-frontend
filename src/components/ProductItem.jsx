import { Box, Heading, IconButton, Stack, Image, Text } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api/axios.js'

export const ProductItem = ({ product, isLiked: initialIsLiked = false, onWishlistChange }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const targetId = product.productId || product.itemId

  function handleProductClick () {
    navigate(`/products/${ targetId }`)
  }

  async function handleLikeButtonClick () {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (isLiked) {
        await api.delete('/wishlists', {
          params: { itemId: targetId }
        })
        setIsLiked(false)

        if (onWishlistChange) {
          onWishlistChange(targetId)
        }
      } else {
        await api.post('/wishlists', { itemId: targetId })
        setIsLiked(true)
      }
    } catch (error) {
      console.error('찜 상태 변경 실패:', error)
      alert('요청을 처리하지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack gap={ 4 }>
      <Box
        position={ 'relative' }
        gap={ 4 }
      >
        <Image
          width={ '100%' }
          aspectRatio={ 1 }
          objectFit={ 'contain' }
          src={ product.thumbnailUrl }
          onClick={ handleProductClick }
          cursor="pointer"
        ></Image>
        <IconButton
          position={ 'absolute' }
          top={ 0 }
          right={ 0 }
          rounded={ 'full' }
          variant={ 'ghost' }
          onClick={ (event) => {
            event.stopPropagation()
            handleLikeButtonClick()
          } }
          isLoading={ isLoading }
        >
          <LuHeart
            color={ isLiked ? 'red' : 'black' }
            fill={ isLiked ? 'red' : 'none' }
          ></LuHeart>
        </IconButton>
      </Box>
      <Stack gap={ 0 }>
        <Text
          textStyle="xs"
          color="fg.muted"
          truncate
        >
          { product.brandName }
        </Text>
        <Heading
          size={ { base: 'sm', md: 'md' } }
          truncate
        >
          { product.productName }
        </Heading>
        <Text
          textStyle={ { base: 'xs', md: 'sm' } }
          fontWeight="bold"
        >
          { product.price?.toLocaleString() } 원
        </Text>
      </Stack>
    </Stack>
  )
}