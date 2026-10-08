import { Button, Card, Flex, Grid, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster.jsx'
import { addToCart } from './aiApi.js'
import { ProductCard } from './ProductCard.jsx'

export const ComboCard = ({ combo, index }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState({})
  const [saving, setSaving] = useState(false)

  const allSelected = combo.items.every((item) => selected[item.productId])

  // 각 상품 카드에서 고른 옵션으로 한 번에 담는다.
  const addAllToCart = async () => {
    setSaving(true)
    try {
      await Promise.all(combo.items.map((item) => addToCart(Number(selected[item.productId]))))
      toaster.create({ type: 'success', title: '코디 전체를 장바구니에 담았어요' })
    } catch {
      toaster.create({ type: 'error', title: '장바구니에 담지 못했어요. 다시 시도해주세요.' })
    } finally {
      setSaving(false)
    }
  }

  const share = () => {
    navigate('/communitywrite', { state: { sharedType: 'COMBO', sharedId: combo.comboId } })
  }

  return (
    <Card.Root rounded={ '2xl' }>
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
        <Flex gap={ 3 } paddingBottom={ 2 } overflowX={ 'auto' }>
          {
            combo.items.map((item) => (
              <ProductCard
                key={ item.productId }
                item={ item }
                onOptionChange={ (productId, optionId) => setSelected((selected) => ({ ...selected, [productId]: optionId })) }
              ></ProductCard>
            ))
          }
        </Flex>
        <Grid templateColumns={ '1fr 1fr' } gap={ 2 }>
          <Button variant={ 'outline' } onClick={ share }>공유하기</Button>
          <Button disabled={ !allSelected } loading={ saving } onClick={ addAllToCart }>전체 장바구니 담기</Button>
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}
