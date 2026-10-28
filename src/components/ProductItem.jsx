import { Box, Image, Text, Heading, IconButton, Stack } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { toaster } from '../components/ui/toaster'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { SignInRequiredDialog } from './SignInRequiredDialog.jsx'
import defaultThumbnail from '../assets/hero.png'

export const ProductItem = ({ product, isLiked: initialIsLiked, onWishlistChange }) => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const [isLiked, setIsLiked] = useState(initialIsLiked ?? product?.wished ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  useEffect(() => {
    setIsLiked(initialIsLiked ?? product?.wished ?? false)
  }, [initialIsLiked, product?.wished])

  const productId = product?.productId
  const productName = product?.productName

  const handleProductClick = () => {
    navigate(`/products/${ productId }`)
  }

  const handleWishClick = async (event) => {
    event.stopPropagation()

    if (!isSignedIn) {
      setIsSignInDialogOpen(true)
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
      }
    } catch (error) {
      console.warn('찜 상태 변경 실패:', error)
      setIsLiked(isLiked)
      toaster.create({
        title: '요청을 처리하지 못했습니다.',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack gap={ 4 }>
      <Box
        position="relative"
        gap={ 4 }
      >
        <Image
          width="100%"
          aspectRatio={ 1 }
          objectFit="contain"
          src={ product?.thumbnailUrl || defaultThumbnail }
          alt={ productName }
          onClick={ handleProductClick }
          cursor="pointer"
        />
        <IconButton
          position="absolute"
          top={ 0 }
          right={ 0 }
          rounded="full"
          variant="ghost"
          aria-label={ isLiked ? '찜 해제' : '찜하기' }
          aria-pressed={ isLiked }
          color={ isLiked ? 'fg.error' : 'fg.muted' }
          onClick={ handleWishClick }
          disabled={ isLoading }
        >
          <LuHeart fill={ isLiked ? 'currentColor' : 'none' } />
        </IconButton>
      </Box>

      <Stack gap={ 0 }>
        <Text
          textStyle="xs"
          color="fg.muted"
          truncate
        >
          { product?.brandName }
        </Text>
        <Heading
          size={ { base: 'sm', md: 'md' } }
          truncate
        >
          { productName }
        </Heading>
        <Text
          textStyle={ { base: 'xs', md: 'sm' } }
          fontWeight="bold"
        >
          { product?.price?.toLocaleString() } 원
        </Text>
      </Stack>

      <SignInRequiredDialog
        open={ isSignInDialogOpen }
        onClose={ () => setIsSignInDialogOpen(false) }
      />
    </Stack>
  )
}
