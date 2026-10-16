import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Portal,
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
import { Toaster } from '../components/ui/toaster.jsx'
import { api } from '../api/axios.js'
import { FailureTestButtons } from '../mocks/FailureTestButtons.jsx'

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

const sizeFeedbackLabels = { SMALL: '작아요', FIT: '잘 맞아요', BIG: '커요' }

const fetchSurveys = (items) => api
  .get('/surveys/me', { params: { orderItemIds: items.map((item) => item.orderItemId).join(',') } })
  .then((response) => Object.fromEntries(response.data.map((survey) => [survey.orderItemId, survey.sizeFeedback])))

const SizeSurvey = ({ feedback, onSubmit }) => {
  const [selected, setSelected] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (feedback) {
    return <Text textStyle={ 'xs' } color={ 'fg.muted' }>사이즈 평가 · { sizeFeedbackLabels[feedback] }</Text>
  }

  const submit = async () => {
    setIsSubmitting(true)
    await onSubmit(selected)
    setIsSubmitting(false)
  }

  return (
    <Stack gap={ 0 }>
      <Text textStyle={ 'xs' } fontWeight={ 'semibold' }>사이즈는 어땠나요?</Text>
      <Text textStyle={ '2xs' } color={ 'fg.muted' }>남긴 평가는 바꿀 수 없어요.</Text>
      <Flex gap={ 4 } wrap={ 'wrap' } marginTop={ 4 }>
        { Object.entries(sizeFeedbackLabels).map(([value, label]) => (
          <Button
            key={ value }
            size={ 'xs' }
            variant={ selected === value ? 'solid' : 'outline' }
            aria-pressed={ selected === value }
            disabled={ isSubmitting }
            onClick={ () => setSelected(value) }
          >
            { label }
          </Button>
        )) }
        <Button size={ 'xs' } colorPalette={ 'primary' } disabled={ !selected } loading={ isSubmitting } onClick={ submit }>
          평가 남기기
        </Button>
      </Flex>
    </Stack>
  )
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
  const [surveys, setSurveys] = useState(null)
  const [isSurveyLoadFailed, setIsSurveyLoadFailed] = useState(false)
  const [surveyError, setSurveyError] = useState(null)
  const [isSurveySaving, setIsSurveySaving] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/signin')
      return
    }

    let cancelled = false
    setOrder(null)
    setErrorMessage('')
    setSurveys(null)
    setIsSurveyLoadFailed(false)
    api.get(`/orders/${ orderId }`)
      .then((response) => {
        if (cancelled) return
        setOrder(response.data)
        if (response.data.orderStatus === 'COMPLETED') {
          fetchSurveys(response.data.items)
            .then((loaded) => !cancelled && mergeSurveys(loaded))
            .catch(() => !cancelled && setIsSurveyLoadFailed(true))
        }
      })
      .catch((error) => !cancelled && setErrorMessage(error.response?.data?.message ?? '주문 정보를 불러오지 못했어요.'))

    return () => { cancelled = true }
  }, [orderId, attempt])

  const mergeSurveys = (loaded) => setSurveys((current) => ({ ...loaded, ...current }))

  const reloadSurveys = () => fetchSurveys(order.items)
    .then((loaded) => {
      mergeSurveys(loaded)
      setIsSurveyLoadFailed(false)
    })
    .catch(() => setIsSurveyLoadFailed(true))

  const submitSurvey = async (orderItemId, sizeFeedback) => {
    setIsSurveySaving(true)
    try {
      await api.post('/surveys', { orderItemId, sizeFeedback })
      setSurveys((current) => ({ ...current, [orderItemId]: sizeFeedback }))
      setSurveyError(null)
    } catch (error) {
      setSurveyError({
        message: error.response?.data?.message || '잠시 후 다시 시도해 주세요.',
        orderItemId,
        sizeFeedback,
        canRetry: !error.response || error.response.status >= 500,
      })
      if (error.response?.data?.code === 'DUPLICATE_SURVEY') {
        reloadSurveys()
      }
    } finally {
      setIsSurveySaving(false)
    }
  }

  const isSurveyable = order?.orderStatus === 'COMPLETED'
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
                  { !isSurveyable && order.orderStatus !== 'CANCELED' && (
                    <Text textStyle={ 'xs' } color={ 'fg.muted' }>구매가 완료되면 상품별 사이즈 평가를 남길 수 있어요.</Text>
                  ) }
                  { isSurveyable && isSurveyLoadFailed && (
                    <Flex justify={ 'space-between' } align={ 'center' } gap={ 4 }>
                      <Text textStyle={ 'xs' } color={ 'fg.error' }>사이즈 평가를 불러오지 못했어요.</Text>
                      <Button variant={ 'outline' } size={ 'xs' } onClick={ reloadSurveys }>다시 시도</Button>
                    </Flex>
                  ) }
                  <Stack gap={ 4 } separator={ <Separator/> }>
                    { order.items.map((item) => (
                      <Stack key={ item.orderItemId } gap={ 4 }>
                        <Flex justify={ 'space-between' } align={ 'start' } gap={ 4 }>
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
                        { isSurveyable && surveys && (
                          <SizeSurvey
                            feedback={ surveys[item.orderItemId] }
                            onSubmit={ (sizeFeedback) => submitSurvey(item.orderItemId, sizeFeedback) }
                          />
                        ) }
                      </Stack>
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
                { import.meta.env.DEV && isSurveyable && (
                  <Stack gap={ 4 }>
                    <FailureTestButtons tests={ [
                      { label: '저장 실패', method: 'post', path: '/surveys' },
                      { label: '조회 실패', method: 'get', path: '/surveys/me', onReady: reloadSurveys },
                    ] }/>
                    <Text textStyle={ 'xs' } color={ 'fg.muted' }>
                      저장 실패를 누른 뒤 미작성 상품의 평가를 남기면 한 번 실패해요. 조회 실패는 즉시 확인할 수 있어요.
                    </Text>
                  </Stack>
                ) }
              </Stack>
            </Grid>
          </>
        ) }
      </Container>

      <Dialog.Root open={ !!surveyError } placement={ 'center' } size={ 'xs' } onOpenChange={ ({ open }) => !open && !isSurveySaving && setSurveyError(null) }>
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>사이즈 평가를 저장하지 못했어요.</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color={ 'fg.muted' }>{ surveyError?.message }</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button flex={ 1 } variant={ 'outline' } disabled={ isSurveySaving } onClick={ () => setSurveyError(null) }>닫기</Button>
                { surveyError?.canRetry && (
                  <Button flex={ 1 } loading={ isSurveySaving } disabled={ isSurveySaving } onClick={ () => submitSurvey(surveyError.orderItemId, surveyError.sizeFeedback) }>
                    다시 시도하기
                  </Button>
                ) }
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <TabBar/>
      <Toaster/>
    </Box>
  )
}
