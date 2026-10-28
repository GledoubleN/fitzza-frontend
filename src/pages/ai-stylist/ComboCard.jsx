import { Button, Card, Flex, Grid, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { ProductCard } from './ProductCard.jsx'
import { ProductRow } from './ProductRow.jsx'
import { addRecommendedOptionToCart } from './recommendedOption.js'

const OPTION_NOT_FOUND_MESSAGE = '추천 옵션이 없어 담지 못했어요. 상품 페이지에서 담아주세요.'
const CART_FAILED_MESSAGE = '담지 못했어요. 다시 눌러주세요.'

// onTryOn: 이 코디의 상품들로 가상 피팅을 시작합니다. tryingOn: 다른 가상 피팅이 진행 중인지.
export const ComboCard = ({ combo, index, wishedProductIds, onToggleWish, onTryOn, tryingOn }) => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  // 전체 담기가 일부만 성공했을 때 이미 담긴 상품. 재시도 때 다시 담지 않습니다.
  const [addedProductIds, setAddedProductIds] = useState([])
  const [cartFailures, setCartFailures] = useState({})

  const markAdded = (productId) => {
    setAddedProductIds((productIds) => productIds.includes(productId) ? productIds : [...productIds, productId])
    setCartFailures((failures) => Object.fromEntries(
      Object.entries(failures).filter(([failedProductId]) => Number(failedProductId) !== productId),
    ))
  }

  const hasAllRecommendedSizes = combo.items.every((item) => item.recommendedSize)

  const addAllToCart = async () => {
    setSaving(true)
    const pending = combo.items.filter((item) => !addedProductIds.includes(item.productId))
    const results = await Promise.allSettled(pending.map(addRecommendedOptionToCart))
    const added = pending
      .filter((_, index) => results[index].status === 'fulfilled' && results[index].value)
      .map((item) => item.productId)
    const failures = Object.fromEntries(pending.flatMap((item, index) => {
      const result = results[index]
      if (result.status === 'fulfilled' && result.value) return []
      return [[item.productId, result.status === 'fulfilled' ? OPTION_NOT_FOUND_MESSAGE : CART_FAILED_MESSAGE]]
    }))
    setCartFailures(failures)
    if (added.length === pending.length) {
      setAddedProductIds([])
      setAdded(true)
    } else {
      setAddedProductIds([...addedProductIds, ...added])
      toaster.create({
        type: 'error',
        title: `상품 ${ pending.length - added.length }개를 담지 못했어요.`,
      })
    }
    setSaving(false)
  }

  const share = () => {
    // 작성 화면에 보여줄 코디 내용.
    navigate('/community/write', {
      state: {
        sharedType: 'COMBO',
        sharedId: combo.comboId,
        snapshot: { items: combo.items, totalPrice: combo.totalPrice },
      },
    })
  }

  return (
    <Card.Root>
      <Card.Body gap={ 3 }>
        <Flex justify={ 'space-between' } align={ 'center' } gap={ 2 }>
          <Text fontWeight={ 'bold' }>코디 { index + 1 }</Text>
          <Text fontWeight={ 'bold' }>합계 { combo.totalPrice.toLocaleString() }원</Text>
        </Flex>
        {
          combo.feedbackSummary &&
          <Text fontSize={ 'sm' } color={ 'fg.muted' }>{ combo.feedbackSummary }</Text>
        }
        {
          combo.budgetExceeded &&
          <Text fontSize={ 'sm' } color={ 'fg.error' }>예산을 초과한 조합이에요</Text>
        }
        <ProductRow>
          {
            combo.items.map((item) => (
              <ProductCard
                key={ item.productId }
                item={ item }
                wished={ wishedProductIds.includes(item.productId) }
                onToggleWish={ onToggleWish }
                cartFailure={ cartFailures[item.productId] }
                onCartAdded={ markAdded }
              ></ProductCard>
            ))
          }
        </ProductRow>
        <Grid templateColumns={ '1fr 1fr' } gap={ 2 }>
          <Button variant={ 'outline' } gridColumn={ 'span 2' } disabled={ tryingOn } onClick={ onTryOn }>바로 입어보기</Button>
          <Button variant={ 'outline' } onClick={ share }>공유하기</Button>
          <Button disabled={ !hasAllRecommendedSizes } loading={ saving } onClick={ addAllToCart }>전체 장바구니 담기</Button>
        </Grid>
        <CartAddedDialog
          open={ added }
          onClose={ () => setAdded(false) }
          description={ `코디 ${ index + 1 }의 상품 ${ combo.items.length }개` }
        ></CartAddedDialog>
      </Card.Body>
    </Card.Root>
  )
}
