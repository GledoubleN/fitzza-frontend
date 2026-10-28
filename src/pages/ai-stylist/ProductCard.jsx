import {
  Badge,
  Button,
  Flex,
  IconButton,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuHeart } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import exampleProductImage from '/src/assets/hero.png'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { addRecommendedOptionToCart, toRecommendedOptionLabel } from './recommendedOption.js'

// 상품 카드 한 칸의 크기. 줄 너비의 2/5를 차지해 다음 카드가 걸쳐 보이게 하되, 너무 작거나 커지지 않게 범위를 둡니다.
// ProductCard가 이 칸을 쓰고, ProductRow의 넘기기 버튼도 사진 높이를 맞추는 데 같은 칸을 씁니다.
export const ProductSlot = (props) => (
  <Flex width={ '2/5' } minWidth={ 32 } maxWidth={ 44 } { ...props }></Flex>
)

// onTryOn: 있으면 이 상품으로 가상 피팅을 시작하는 버튼을 보여줍니다. tryingOn: 다른 가상 피팅이 진행 중인지.
export const ProductCard = ({ item, onTryOn, tryingOn }) => {
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  const optionLabel = toRecommendedOptionLabel(item)

  const submit = async () => {
    setSaving(true)
    try {
      if (await addRecommendedOptionToCart(item)) {
        setAdded(true)
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
    <ProductSlot direction={ 'column' } gap={ 2 } position={ 'relative' } flexShrink={ 0 } scrollSnapAlign={ 'start' }>
      <Stack gap={ 1 } flex={ 1 } asChild>
        <Link to={ `/products/${ item.productId }` }>
          <Image
            src={ item.imageUrl || exampleProductImage }
            alt={ item.productName }
            aspectRatio={ 1 }
            objectFit={ 'contain' }
            bg={ 'bg.muted' }
          ></Image>
          <Text fontSize={ 'sm' } lineClamp={ 1 }>{ item.productName }</Text>
          <Text fontSize={ 'sm' } fontWeight={ 'bold' }>{ item.price.toLocaleString() }원</Text>
          {
            optionLabel &&
            <Text fontSize={ 'xs' }>{ optionLabel }</Text>
          }
          {
            item.fitPercent != null &&
            <Badge alignSelf={ 'flex-start' }>핏 { item.fitPercent }%</Badge>
          }
          {
            item.evidence &&
            <Text fontSize={ 'xs' } color={ 'fg.muted' }>{ item.evidence }</Text>
          }
        </Link>
      </Stack>
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
      <IconButton
        position={ 'absolute' }
        top={ 0 }
        right={ 0 }
        size={ 'sm' }
        variant={ 'ghost' }
        rounded={ 'full' }
        aria-label={ '찜' }
      >
        <LuHeart></LuHeart>
      </IconButton>
      <CartAddedDialog
        open={ added }
        onClose={ () => setAdded(false) }
        description={ item.productName }
      ></CartAddedDialog>
    </ProductSlot>
  )
}
