import { Button, Card, Flex, Grid, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from './ProductCard.jsx'

export const ComboCard = ({ combo, index, onAddToCart }) => {
  const navigate = useNavigate()

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
              <ProductCard key={ item.productId } item={ item }></ProductCard>
            ))
          }
        </Flex>
        <Grid templateColumns={ '1fr 1fr' } gap={ 2 }>
          <Button variant={ 'outline' } onClick={ share }>공유하기</Button>
          <Button onClick={ () => onAddToCart(combo) }>전체 장바구니 담기</Button>
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}
