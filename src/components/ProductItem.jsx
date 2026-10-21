import { Box, Image, Text, IconButton, VStack } from '@chakra-ui/react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { toaster } from '../components/ui/toaster'
import { useState } from 'react'

export const ProductItem = ({ product, isLiked: initialIsLiked, onWishlistChange }) => {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? product.wished ?? false)

  const handleWishClick = async (e) => {
    e.stopPropagation() // 상품 상세 페이지로의 이동 이벤트 전파 방지

    // 1. 로그인 상태 확인 (토큰 유무 검사)
    const token = localStorage.getItem('accessToken') // 프로젝트 내 토큰 저장소 키명에 맞춰 확인해주세요
    if (!token) {
      navigate('/signin')
      return
    }

    try {
      if (isLiked) {
        // 찜 취소 요청
        await api.delete('/wishlists', { data: { itemId: product.productId ?? product.itemId } })
        setIsLiked(false)
        toaster.create({
          title: '찜 목록에서 제외되었습니다.',
          type: 'success',
        })
        if (onWishlistChange) {
          onWishlistChange(product.productId ?? product.itemId)
        }
      } else {
        // 찜 등록 요청
        await api.post('/wishlists', { itemId: product.productId ?? product.itemId })
        setIsLiked(true)
        toaster.create({
          title: '찜 목록에 추가되었습니다.',
          type: 'success',
        })
      }
    } catch (error) {
      console.warn('찜 상태 변경 실패:', error)
      if (error.response?.status === 401) {
        navigate('/signin')
      } else {
        toaster.create({
          title: '요청을 처리하지 못했습니다.',
          type: 'error',
        })
      }
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
        >
          <Heart fill={isLiked ? 'red' : 'none'} color={isLiked ? 'red' : 'currentColor'} />
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