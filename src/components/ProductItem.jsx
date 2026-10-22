import { Box, Image, Text, Heading, IconButton, VStack } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { toaster } from '../components/ui/toaster'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import defaultThumbnail from '../assets/hero.png'

export const ProductItem = ({ product, isLiked: initialIsLiked, onWishlistChange }) => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const [isLiked, setIsLiked] = useState(initialIsLiked ?? product?.wished ?? false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLiked(initialIsLiked ?? product?.wished ?? false)
  }, [initialIsLiked, product?.wished])

  const productId = product?.productId ?? product?.itemId
  const productName = product?.productName ?? product?.name

  const handleWishClick = async (e) => {
    e.stopPropagation()

    if (!isSignedIn) {
      navigate('/signin')
      return
    }

    if (isLoading) return

    const nextLikedState = !isLiked

    setIsLiked(nextLikedState)
    setIsLoading(true)

    try {
      if (!nextLikedState) {
        await api.delete('/wishlists', { params: { itemId: productId } })
        toaster.create({
          title: '찜 목록에서 제외되었습니다.',
          type: 'success',
        })
        if (onWishlistChange) {
          onWishlistChange(productId)
        }
      } else {
        await api.post('/wishlists', { itemId: productId })
        toaster.create({
          title: '찜 목록에 추가되었습니다.',
          type: 'success',
        })
        if (onWishlistChange) {
          onWishlistChange(productId)
        }
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
      onClick={() => navigate(`/products/${productId}`)}
      gap={2}
    >
      <Box position="relative" width="100%" paddingTop="100%" bg="bg.muted" borderRadius="md" overflow="hidden">
        <Image
          src={product?.thumbnailUrl ?? product?.imageUrl ?? defaultThumbnail}
          alt={productName}
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
          aria-label={isLiked ? '찜 해제' : '찜하기'}
          variant="ghost"
          size="sm"
          onClick={handleWishClick}
          disabled={isLoading}
        >
          <LuHeart
            fill={isLiked ? 'red' : 'none'}
            color={isLiked ? 'red' : 'black'}
          />
        </IconButton>
      </Box>
      <VStack align="start" gap={1}>
        <Text textStyle="xs" color="fg.muted" truncate>
          {product?.brandName}
        </Text>
        <Heading size="sm" truncate width="100%">
          {productName}
        </Heading>
        <Text textStyle="sm" fontWeight="bold">
          {product?.price != null ? `${Number(product.price).toLocaleString()}원` : '가격 정보 없음'}
        </Text>
      </VStack>
    </VStack>
  )
}