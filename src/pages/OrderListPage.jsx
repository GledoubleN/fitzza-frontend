import { useAuth } from '../contexts/AuthContext.js'
import { Badge, Button, Card, Container, Flex, Heading, Image, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { api } from '../api/axios.js'
import { formatPrice, orderStatusLabels } from './OrderDetailPage.jsx'

const formatDate = (dateTime) => new Date(dateTime).toLocaleDateString('ko-KR')

export const OrderListPage = () => {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin', { replace: true })
      return
    }

    let cancelled = false
    setIsLoading(true)
    setIsLoadFailed(false)
    api.get('/orders', { params: { page, size: 10 } })
      .then(({ data }) => {
        if (cancelled) return
        setOrders((orders) => page === 0 ? data.content : [...orders, ...data.content])
        setTotalPages(data.totalPages)
      })
      .catch(() => !cancelled && setIsLoadFailed(true))
      .finally(() => !cancelled && setIsLoading(false))

    return () => { cancelled = true }
  }, [page, attempt, isSignedIn, navigate])

  return (
    <Stack gap={ 4 } paddingY={ 4 } paddingBottom={ 28 } minHeight={ 'vh' } bg={ 'bg' }>
      <Header/>

      <Container maxWidth={ '3xl' }>
        <Stack gap={ 4 }>
          <Heading>주문 내역</Heading>

          { orders.map((order) => (
            <Card.Root key={ order.orderId } asChild bg={ 'bg.panel' } _hover={ { bg: 'bg.subtle' } }>
              <RouterLink to={ `/orders/${ order.orderId }` }>
                <Card.Body>
                  <Flex gap={ 4 } align={ 'center' }>
                    <Image
                      boxSize={ '16' }
                      objectFit={ 'contain' }
                      rounded={ 'l2' }
                      bg={ 'bg.muted' }
                      src={ order.thumbnailUrl ?? undefined }
                      alt={ '' }
                    />
                    <Stack gap={ 0 } minWidth={ 0 } flex={ 1 }>
                      <Flex gap={ 4 } align={ 'center' }>
                        <Text textStyle={ 'sm' } fontWeight={ 'semibold' }>{ formatDate(order.createdAt) }</Text>
                        <Badge colorPalette={ order.orderStatus === 'CANCELED' ? 'secondary' : 'primary' }>
                          { orderStatusLabels[order.orderStatus] ?? order.orderStatus }
                        </Badge>
                      </Flex>
                      <Text textStyle={ 'xs' } color={ 'fg.muted' } truncate>주문번호 { order.orderNum }</Text>
                      <Text textStyle={ 'sm' }>상품 { order.itemCount }개 · { formatPrice(order.totalPrice) }</Text>
                    </Stack>
                  </Flex>
                </Card.Body>
              </RouterLink>
            </Card.Root>
          )) }

          { isLoading && <Spinner size={ 'sm' } alignSelf={ 'center' }/> }
          { !isLoading && isLoadFailed && (
            <Stack align={ 'center' } gap={ 4 }>
              <Text color={ 'fg.muted' }>주문 내역을 불러오지 못했어요.</Text>
              <Button variant={ 'outline' } onClick={ () => setAttempt(attempt + 1) }>다시 시도</Button>
            </Stack>
          ) }
          { !isLoading && !isLoadFailed && orders.length === 0 && (
            <Stack align={ 'center' } gap={ 4 } paddingY={ 20 }>
              <Text color={ 'fg.muted' }>아직 주문한 상품이 없어요.</Text>
              <Button variant={ 'outline' } onClick={ () => navigate('/') }>쇼핑하러 가기</Button>
            </Stack>
          ) }
          { !isLoading && !isLoadFailed && page + 1 < totalPages && (
            <Button variant={ 'ghost' } onClick={ () => setPage(page + 1) }>더 보기</Button>
          ) }
        </Stack>
      </Container>

      <TabBar/>
    </Stack>
  )
}
