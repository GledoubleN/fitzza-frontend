import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuHeart } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { addRecommendedOptionToCart, toRecommendedOptionLabel } from './recommendedOption.js'

// 상품 카드 한 칸의 크기. 줄 너비의 2/5를 차지해 다음 카드가 걸쳐 보이게 하되, 너무 작거나 커지지 않게 범위를 둡니다.
// ProductCard가 이 칸을 쓰고, ProductRow의 넘기기 버튼도 사진 높이를 맞추는 데 같은 칸을 씁니다.
export const ProductSlot = (props) => (
  <Flex width={ '2/5' } minWidth={ 32 } maxWidth={ 44 } { ...props }></Flex>
)

// onTryOn: 있으면 이 상품으로 가상 피팅을 시작하는 버튼을 보여줍니다. tryingOn: 다른 가상 피팅이 진행 중인지.
export const ProductCard = ({ item, wished, onToggleWish, cartFailure, onCartAdded, onTryOn, tryingOn }) => {
  const [saving, setSaving] = useState(false)
  const [wishSaving, setWishSaving] = useState(false)
  const [added, setAdded] = useState(false)
  const optionLabel = toRecommendedOptionLabel(item)

  const toggleWish = async () => {
    setWishSaving(true)
    await onToggleWish(item.productId)
    setWishSaving(false)
  }

  const submit = async () => {
    setSaving(true)
    try {
      if (await addRecommendedOptionToCart(item)) {
        setAdded(true)
        onCartAdded?.(item.productId)
      } else {
        toaster.create({ type: 'error', title: '추천 옵션을 찾지 못했어요. 상품 페이지에서 담아주세요.' })
      }
    } catch {
      toaster.create({ type: 'error', title: '장바구니에 담지 못했어요. 다시 시도해주세요.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProductSlot
      className={ 'group' }
      direction={ 'column' }
      gap={ 3 }
      padding={ 2 }
      paddingBottom={ 3 }
      position={ 'relative' }
      flexShrink={ 0 }
      scrollSnapAlign={ 'start' }
      bg={ 'bg.panel' }
      borderWidth={ 'thin' }
      borderColor={ 'border.subtle' }
      boxShadow={ 'sm' }
      transition={ 'box-shadow 0.25s ease' }
      _hover={ { boxShadow: 'lg' } }
    >
      <Box
        position={ 'relative' }
        aspectRatio={ 3 / 4 }
        overflow={ 'hidden' }
        bg={ 'bg.muted' }
      >
        <ProductImage
          width={ 'full' }
          height={ 'full' }
          objectFit={ 'cover' }
          src={ item.imageUrl }
          alt={ item.productName }
          transition={ 'transform 0.4s ease' }
          _groupHover={ { transform: 'scale(1.05)' } }
        />
        <IconButton
          position={ 'absolute' }
          top={ 1 }
          right={ 1 }
          zIndex={ 1 }
          size={ 'sm' }
          rounded={ 'full' }
          variant={ 'ghost' }
          backdropFilter={ 'auto' }
          _hover={ { bg: 'bg.muted/70', backdropBlur: 'lg' } }
          aria-label={ wished ? '찜 해제' : '찜하기' }
          aria-pressed={ wished }
          color={ wished ? 'primary.solid' : 'fg.muted' }
          disabled={ wishSaving }
          onClick={ toggleWish }
        >
          <LuHeart fill={ wished ? 'currentColor' : 'none' }/>
        </IconButton>
      </Box>

      <Stack
        gap={ 1 }
        flex={ 1 }
      >
        <Text
          textStyle={ 'sm' }
          lineClamp={ 2 }
          minHeight={ '2lh' }
        >
          <LinkOverlay asChild>
            <Link to={ `/products/${ item.productId }` }>
              { item.productName }
            </Link>
          </LinkOverlay>
        </Text>
        <Text
          textStyle={ { base: 'sm', md: 'md' } }
          fontWeight={ 'bold' }
        >
          { item.price.toLocaleString() } 원
        </Text>
        {
          optionLabel &&
          <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ optionLabel }</Text>
        }
        {
          item.fitPercent != null &&
          <Badge alignSelf={ 'flex-start' }>핏 { item.fitPercent }%</Badge>
        }
        {
          item.evidence &&
          <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ item.evidence }</Text>
        }
      </Stack>
      {
        cartFailure &&
        <Text textStyle={ 'xs' } color={ 'fg.error' }>{ cartFailure }</Text>
      }
      <Stack
        gap={ 2 }
        position={ 'relative' }
        zIndex={ 1 }
      >
        <Button
          size={ 'xs' }
          variant={ 'outline' }
          disabled={ !item.recommendedSize }
          loading={ saving }
          onClick={ submit }
        >
          장바구니 담기
        </Button>
        {
          onTryOn &&
          <Button size={ 'xs' } variant={ 'outline' } disabled={ tryingOn } onClick={ onTryOn }>바로 입어보기</Button>
        }
      </Stack>
      <CartAddedDialog
        open={ added }
        onClose={ () => setAdded(false) }
        description={ item.productName }
      ></CartAddedDialog>
    </ProductSlot>
  )
}
