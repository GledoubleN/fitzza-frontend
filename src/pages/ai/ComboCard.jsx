import { Button, Card, Flex, Grid, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../../components/ui/toaster.jsx'
import { addToCart } from './aiApi.js'
import { ProductCard } from './ProductCard.jsx'

export const ComboCard = ({ combo, combos, index }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState({})
  const [saving, setSaving] = useState(false)
  // 전체 담기가 일부만 성공했을 때 이미 담긴 옵션. 재시도 때 다시 담지 않는다.
  const [addedOptionIds, setAddedOptionIds] = useState([])

  const allSelected = combo.items.every((item) => selected[item.productId])

  // 각 상품 카드에서 고른 옵션으로 한 번에 담는다.
  const addAllToCart = async () => {
    setSaving(true)
    const pending = combo.items
      .map((item) => selected[item.productId])
      .filter((optionId) => !addedOptionIds.includes(optionId))
    const results = await Promise.allSettled(pending.map((optionId) => addToCart(Number(optionId))))
    const added = pending.filter((_, i) => results[i].status === 'fulfilled')
    if (added.length === pending.length) {
      setAddedOptionIds([])
      toaster.create({ type: 'success', title: '코디 전체를 장바구니에 담았어요' })
    } else {
      setAddedOptionIds([...addedOptionIds, ...added])
      toaster.create({ type: 'error', title: '일부 상품을 담지 못했어요. 다시 누르면 남은 상품만 담아요.' })
    }
    setSaving(false)
  }

  const share = () => {
    // snapshot: 작성 화면에 보여줄 코디 내용. 공유 초안 조회 API(/posts/share-draft)의 응답 형태를 따른다.
    navigate('/communitywrite', {
      state: {
        sharedType: 'COMBO',
        sharedId: combo.comboId,
        snapshot: { items: combo.items, totalPrice: combo.totalPrice },
        // 작성 화면에서 투표를 고르면 추천받은 코디들이 선택지로 들어간다. 투표 게시글 작성 API의 options 형태를 따른다.
        voteOptions: combos.map((combo, index) => ({
          source: 'AI_RECOMMEND',
          itemType: 'COMBO',
          itemId: combo.comboId,
          label: `코디 ${ index + 1 }`,
          items: combo.items,
        })),
      },
    })
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
