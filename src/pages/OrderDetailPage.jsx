import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Separator,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuFileText, LuPackage } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { api } from '../api/axios.js'

export const orderStatusLabels = {
  PENDING: '주문 접수',
  PAID: '결제 완료',
  SHIPPING: '배송 중',
  COMPLETED: '주문 완료',
  CANCELED: '주문 취소',
}

export const formatPrice = (price) => `${ price.toLocaleString() }원`

export const maskPhone = (phone) => {
  const match = phone.match(/^(\+?\d{2,3})(.*)(\d{4})$/)
  return match ? `${ match[1] }${ match[2].replace(/\d/g, '*') }${ match[3] }` : phone.replace(/\d/g, '*')
}

const PanelCard = ({ title, children }) => (
  <Card.Root variant={ 'subtle' } borderWidth={ 'thin' } borderColor={ 'border.subtle' } bg={ 'bg.panel' }>
    <Card.Body gap={ 4 }>
      <Text fontWeight={ 'bold' } textStyle={ 'sm' }>{ title }</Text>
      { children }
    </Card.Body>
  </Card.Root>
)

export const OrderDetail = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/signin')
      return
    }

    let cancelled = false
    setOrder(null)
    setErrorMessage('')
    api.get(`/orders/${ orderId }`)
      .then((response) => !cancelled && setOrder(response.data))
      .catch((error) => !cancelled && setErrorMessage(error.response?.data?.message ?? '주문 정보를 불러오지 못했어요.'))

    return () => { cancelled = true }
  }, [orderId, attempt])

  const itemsPrice = order?.items.reduce((sum, item) => sum + item.unitPrice * item.orderQty, 0)

  return (
    <Box position={ 'relative' } minHeight={ 'vh' } paddingTop={ 4 } paddingBottom={ 28 } bg={ 'bg' }>
      <Header/>
      <Container maxWidth={ '5xl' } paddingY={ 4 }>

        <HStack gap={ 4 } marginBottom={ 4 }>
          <Heading textStyle={ 'lg' }>주문 상세</Heading>
        </HStack>

        { !order ? (
          <Stack align={ 'center' } gap={ 4 } paddingY={ 20 }>
            { errorMessage ? (
              <>
                <Text color={ 'fg.muted' }>{ errorMessage }</Text>
                <Button variant={ 'outline' } onClick={ () => setAttempt(attempt + 1) }>다시 시도</Button>
              </>
            ) : <Spinner/> }
          </Stack>
        ) : (
          <>
            <Flex align={ 'center' } gap={ 4 } marginBottom={ 8 }>
              <Text textStyle={ 'xs' } color={ 'fg.muted' }>주문번호 { order.orderNum }</Text>
              <Badge colorPalette={ order.orderStatus === 'CANCELED' ? 'secondary' : 'primary' }>
                { orderStatusLabels[order.orderStatus] ?? order.orderStatus }
              </Badge>
            </Flex>

            <Grid templateColumns={ { base: '1fr', lg: '1fr 1fr' } } gap={ 8 } alignItems={ 'start' }>
              <Stack gap={ 8 }>
                <PanelCard title={ `주문 상품 ${ order.items.length }개` }>
                  <Stack gap={ 4 } separator={ <Separator/> }>
                    { order.items.map((item) => (
                      <Flex key={ item.orderItemId } justify={ 'space-between' } align={ 'start' } gap={ 4 }>
                        <Stack gap={ 0 } minWidth={ 0 }>
                          { item.productId && item.productName ? (
                            <Link asChild fontWeight={ 'semibold' } textStyle={ 'sm' }>
                              <RouterLink to={ `/products/${ item.productId }` }>{ item.productName }</RouterLink>
                            </Link>
                          ) : (
                            <Text fontWeight={ 'semibold' } textStyle={ 'sm' } truncate>
                              { item.productName ?? '상품 정보를 불러오지 못했어요.' }
                            </Text>
                          ) }
                          { (item.color || item.size) && (
                            <Text textStyle={ 'xs' } color={ 'fg.muted' }>
                              { [item.color, item.size].filter(Boolean).join(' / ') }
                            </Text>
                          ) }
                          <Text textStyle={ 'xs' } color={ 'fg.muted' }>수량 { item.orderQty }개</Text>
                        </Stack>
                        <Text textStyle={ 'sm' } fontWeight={ 'semibold' } whiteSpace={ 'nowrap' }>
                          { formatPrice(item.unitPrice * item.orderQty) }
                        </Text>
                      </Flex>
                    )) }
                  </Stack>
                </PanelCard>
              </Stack>

              <Stack gap={ 8 } position={ { lg: 'sticky' } } top={ 4 }>
                <PanelCard title={ '주문 금액' }>
                  <HStack justify={ 'space-between' } textStyle={ 'xs' }>
                    <Text color={ 'fg.muted' }>상품 금액</Text>
                    <Text>{ formatPrice(itemsPrice) }</Text>
                  </HStack>
                  <Separator/>
                  <HStack justify={ 'space-between' }>
                    <Text fontWeight={ 'bold' } textStyle={ 'sm' }>총 주문 금액</Text>
                    <Text fontWeight={ 'bold' } textStyle={ 'md' } color={ 'primary.solid' }>
                      { formatPrice(order.totalPrice) }
                    </Text>
                  </HStack>
                </PanelCard>

                <PanelCard title={ '배송정보' }>
                  <Stack gap={ 0 }>
                    <Text textStyle={ 'sm' } fontWeight={ 'medium' }>{ order.recipient?.name }</Text>
                    { order.recipient?.phone && (
                      <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ maskPhone(order.recipient.phone) }</Text>
                    ) }
                    <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ order.shippingAddress }</Text>
                  </Stack>
                </PanelCard>

                <Card.Root variant={ 'subtle' } borderWidth={ 'thin' } borderColor={ 'border.subtle' } bg={ 'bg.panel' }>
                  <Card.Body gap={ 4 }>
                    <Stack gap={ 0 }>
                      <Text fontWeight={ 'bold' } textStyle={ 'sm' }>취소 및 반품 안내</Text>
                      <Text textStyle={ '2xs' } color={ 'fg.muted' }>가능 여부와 비용을 확인해 주세요.</Text>
                    </Stack>
                    <HStack gap={ 4 }>
                      <LuFileText/>
                      <Text textStyle={ 'sm' }>취소 안내</Text>
                    </HStack>
                    <HStack gap={ 4 }>
                      <LuPackage/>
                      <Text textStyle={ 'sm' }>반품 안내</Text>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              </Stack>
            </Grid>
          </>
        ) }
      </Container>

      <TabBar/>
    </Box>
  )
}
