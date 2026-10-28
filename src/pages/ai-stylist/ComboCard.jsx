import { Button, Card, Flex, Grid, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { ProductCard } from './ProductCard.jsx'
import { ProductRow } from './ProductRow.jsx'

// 응답이 오지 않는 요청은 10초 뒤 실패로 처리해 화면이 재시도 안내까지 갈 수 있게 합니다.
const TIMEOUT = { timeout: 10000 }

// onTryOn: 이 코디의 상품들로 가상 피팅을 시작합니다. tryingOn: 다른 가상 피팅이 진행 중인지.
export const ComboCard = ({ combo, index, onTryOn, tryingOn }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState({})
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  // 전체 담기가 일부만 성공했을 때 이미 담긴 옵션. 재시도 때 다시 담지 않습니다.
  const [addedOptionIds, setAddedOptionIds] = useState([])

  const allSelected = combo.items.every((item) => selected[item.productId])

  // 전체담기, 각 상품 카드에서 고른 옵션으로 한 번에 담습니다.
  const addAllToCart = async () => {
    setSaving(true)
    const pending = combo.items
      .map((item) => selected[item.productId])
      .filter((optionId) => !addedOptionIds.includes(optionId))
    const results = await Promise.allSettled(pending.map((optionId) =>
      api.post('/carts', { optionId: Number(optionId), quantity: 1 }, TIMEOUT)))
    const added = pending.filter((_, i) => results[i].status === 'fulfilled')
    if (added.length === pending.length) {
      setAddedOptionIds([])
      setAdded(true)
    } else {
      setAddedOptionIds([...addedOptionIds, ...added])
      toaster.create({ type: 'error', title: '일부 상품을 담지 못했어요. 다시 누르면 남은 상품만 담아요.' })
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
                onOptionChange={ (productId, optionId) => setSelected((selected) => ({ ...selected, [productId]: optionId })) }
              ></ProductCard>
            ))
          }
        </ProductRow>
        <Grid templateColumns={ '1fr 1fr' } gap={ 2 }>
          <Button variant={ 'outline' } gridColumn={ 'span 2' } disabled={ tryingOn } onClick={ onTryOn }>바로 입어보기</Button>
          <Button variant={ 'outline' } onClick={ share }>공유하기</Button>
          <Button disabled={ !allSelected } loading={ saving } onClick={ addAllToCart }>전체 장바구니 담기</Button>
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
