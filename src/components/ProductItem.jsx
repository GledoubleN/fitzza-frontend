import { Badge, Box, Image, Text, IconButton, Stack } from '@chakra-ui/react'
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

  const isSoldOut = product?.status === 'SOLD_OUT'

  return (
    <>
      <Stack
        role="group"
        gap={ 3 }
        padding={ 2 }
        paddingBottom={ 3 }
        bg="bg.panel"
        borderWidth="thin"
        borderColor="border.subtle"
        boxShadow="sm"
        transition="box-shadow 0.25s ease"
        _hover={ { boxShadow: 'lg' } }
        cursor="pointer"
        onClick={ handleProductClick }
      >
        <Box
          position="relative"
          aspectRatio={ 3 / 4 }
          overflow="hidden"
          bg="bg.muted"
        >
          <Image
            width="full"
            height="full"
            objectFit="cover"
            src={ product?.thumbnailUrl || defaultThumbnail }
            alt={ productName }
            opacity={ isSoldOut ? 0.5 : 1 }
            transition="transform 0.4s ease"
            _groupHover={ { transform: 'scale(1.05)' } }
          />
          { isSoldOut && (
            <Badge
              position="absolute"
              top={ 2 }
              left={ 2 }
              variant="solid"
              colorPalette="gray"
            >
              품절
            </Badge>
          ) }
          <IconButton
            position="absolute"
            top={ 2 }
            right={ 2 }
            size="sm"
            rounded="full"
            variant="ghost"
            backdropFilter="auto"
            _hover={ { bg: 'bg.muted/70', backdropBlur: 'lg' } }
            aria-label={ isLiked ? '찜 해제' : '찜하기' }
            aria-pressed={ isLiked }
            color={ isLiked ? 'fg.error' : 'fg.muted' }
            onClick={ handleWishClick }
            disabled={ isLoading }
          >
            <LuHeart fill={ isLiked ? 'currentColor' : 'none' } />
          </IconButton>
        </Box>

        <Stack gap={ 1 }>
          <Text
            textStyle="xs"
            fontWeight="semibold"
            letterSpacing="wide"
            textTransform="uppercase"
            color="fg.muted"
            truncate
          >
            { product?.brandName }
          </Text>
          <Text
            textStyle="sm"
            lineClamp={ 2 }
            minHeight="2lh"
          >
            { productName }
          </Text>
          <Text
            textStyle={ { base: 'sm', md: 'md' } }
            fontWeight="bold"
          >
            { product?.price?.toLocaleString() } 원
          </Text>
        </Stack>
      </Stack>

      <SignInRequiredDialog
        open={ isSignInDialogOpen }
        onClose={ () => setIsSignInDialogOpen(false) }
      />
    </>
  )
}
