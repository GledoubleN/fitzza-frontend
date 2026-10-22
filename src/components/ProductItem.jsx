import { Box, Image, Text, IconButton, VStack } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { toaster } from '../components/ui/toaster'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const ProductItem = ({ product, isLiked: initialIsLiked, onWishlistChange }) => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? product.wished ?? false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWishClick = async (e) => {
    e.stopPropagation()

    if (!isSignedIn) {
      navigate('/signin')
      return
    }

    if (isLoading) return

    const nextLikedState = !isLiked
    const itemId = product.productId ?? product.itemId

    setIsLiked(nextLikedState)
    setIsLoading(true)

    try {
      if (!nextLikedState) {
        await api.delete('/wishlists', { params: { itemId } })
        toaster.create({
          title: '찜 목록에서 제외되었습니다.',
          type: 'success',
        })
        if (onWishlistChange) {
          onWishlistChange(itemId)
        }
      } else {
        await api.post('/wishlists', { itemId })
        toaster.create({
          title: '찜 목록에 추가되었습니다.',
          type: 'success',
        })
      }
    } catch (error) {
      console.warn('찜 상태 변경 실패:', error)
      setIsLiked(isLiked)

      if (error.response?.status === 401) {
        navigate('/signin')
      } else {
        toaster.create({
          title: '요청을 처리하지 못했습니다.',
          type: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack
      align="stretch"
      cursor="pointer"
      onClick={() => navigate(`/products/${product.productId ?? product.itemId}`)}
      gap={2}
    >
      <Box position="relative" width="100%" paddingTop="100%" bg="gray.100" borderRadius="md" overflow="hidden">
        <Image
          src={product.thumbnailUrl ?? product.imageUrl ?? '/src/assets/hero.png'}
          alt={product.productName ?? product.name}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
        />
        <IconButton
          position="absolute"
          top={2}
          right={2}
          aria-label="Wishlist"
          variant="ghost"
          size="sm"
          onClick={handleWishClick}
          disabled={isLoading}
        >
          <LuHeart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'currentColor'} />
        </IconButton>
      </Box>
      <VStack align="start" gap={1}>
        <Text fontSize="xs" color="fg.muted" truncate>
          {product.brandName}
        </Text>
        <Text fontSize="sm" fontWeight="medium" truncate width="100%">
          {product.productName ?? product.name}
        </Text>
        <Text fontSize="sm" fontWeight="bold">
          {Number(product.price).toLocaleString()}원
        </Text>
      </VStack>
    </VStack>
  )
}