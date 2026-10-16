import { useAuth } from '../contexts/AuthContext.js'
import {
  Button,
  Card,
  Container,
  Dialog,
  Field,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Portal,
  Separator,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuCircleCheck } from 'react-icons/lu'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'
import { Toaster, toaster } from '../components/ui/toaster.jsx'
import { api } from '../api/axios.js'
import { FailureTestButtons } from '../mocks/FailureTestButtons.jsx'

const formatPrice = (price) => `${ price.toLocaleString() }원`

const formatPhone = (value) => {
  const head = value.replace(/\D/g, '').startsWith('02') ? 2 : 3
  const digits = value.replace(/\D/g, '').slice(0, head + 8)
  const middle = digits.length >= head + 7 ? digits.length - head - 4 : 4
  return [digits.slice(0, head), digits.slice(head, head + middle), digits.slice(head + middle)].filter(Boolean).join('-')
}

const caretAfterDigits = (formatted, digitCount) => {
  if (digitCount === 0) return 0
  let seen = 0
  const index = [...formatted].findIndex((char) => /\d/.test(char) && ++seen === digitCount)
  return index === -1 ? formatted.length : index + 1
}

const changePhone = (input) => {
  const digitsBeforeCaret = input.value.slice(0, input.selectionStart).replace(/\D/g, '').length
  const formatted = formatPhone(input.value)
  requestAnimationFrame(() => {
    const caret = caretAfterDigits(formatted, digitsBeforeCaret)
    input.setSelectionRange(caret, caret)
  })
  return formatted
}

const isValidPhone = (phone) => /^(02\d{7,8}|0\d{9,10})$/.test(phone.replace(/-/g, ''))

const isFilled = (value) => value.trim() !== ''

const recipientFields = [
  { name: 'recipientName', label: '받는 분', placeholder: '이름', error: '받는 분을 입력해 주세요.', isValid: isFilled },
  {
    name: 'recipientPhone',
    label: '연락처',
    placeholder: '010-1234-5678',
    inputMode: 'tel',
    error: '연락처를 올바르게 입력해 주세요. (예: 010-1234-5678)',
    isValid: isValidPhone,
    toValue: changePhone,
  },
  {
    name: 'postalCode',
    label: '우편번호',
    placeholder: '00000',
    inputMode: 'numeric',
    error: '우편번호 5자리를 입력해 주세요.',
    isValid: (value) => /^\d{5}$/.test(value),
    toValue: (input) => input.value.replace(/\D/g, '').slice(0, 5),
  },
  { name: 'roadAddress', label: '도로명 주소', placeholder: '시,군,구', maxLength: 100, error: '도로명 주소를 입력해 주세요.', isValid: isFilled },
  { name: 'detailAddress', label: '상세주소', placeholder: '동·호수 (선택)', maxLength: 100, optional: true, isValid: () => true },
]

const orderError = (status, code, message) => (HttpResponse) => HttpResponse.json({ code, message }, { status })

const failureTests = [
  { label: '다음 주문 서버 오류', method: 'post', path: '/orders' },
  { label: '다음 주문 연결 끊김', method: 'post', path: '/orders', respond: (HttpResponse) => HttpResponse.error() },
  {
    label: '다음 주문 장바구니 변경',
    method: 'post',
    path: '/orders',
    respond: orderError(404, 'CART_NOT_FOUND', '장바구니 항목을 찾을 수 없습니다.'),
  },
  {
    label: '다음 주문 품절',
    method: 'post',
    path: '/orders',
    respond: orderError(400, 'OPTION_NOT_AVAILABLE', '주문할 수 없는 상품 옵션이 포함되어 있습니다.'),
  },
]

const testRecipient = {
  recipientName: '김테스트',
  recipientPhone: '010-1234-5678',
  postalCode: '06234',
  roadAddress: '서울시 강남구 테헤란로 1',
  detailAddress: '101동 101호',
}

const CART_ERROR_CODES = ['CART_NOT_FOUND', 'OPTION_NOT_AVAILABLE']

const toOrderFailure = (error) => {
  const { status, data } = error.response ?? {}
  if (CART_ERROR_CODES.includes(data?.code)) {
    return { type: 'cart', title: data.message ?? '장바구니가 변경되었어요.', description: '장바구니에서 상품을 다시 확인해 주세요.' }
  }
  if (!status || status >= 500) {
    return { type: 'retry', title: '주문하지 못했어요.', description: '잠시 후 다시 시도해 주세요.' }
  }
}

const toShippingAddress = ({ postalCode, roadAddress, detailAddress }) => (
  `[${ postalCode }] ${ roadAddress.trim() } ${ detailAddress.trim() }`.trim()
)

const SummaryRow = ({ label, value }) => (
  <Flex justify={ 'space-between' } gap={ 4 }>
    <Text color={ 'fg.muted' } flexShrink={ 0 }>{ label }</Text>
    <Text textAlign={ 'end' }>{ value }</Text>
  </Flex>
)

const OrderComplete = ({ order }) => {
  const navigate = useNavigate()
  const [firstItem] = order.items

  return (
    <Container maxWidth={ 'md' }>
      <Stack gap={ 8 } align={ 'center' } paddingY={ 12 }>
        <Stack gap={ 4 } align={ 'center' }>
          <Icon boxSize={ 12 } color={ 'fg.success' }><LuCircleCheck/></Icon>
          <Heading>주문이 완료되었어요</Heading>
          <Text color={ 'fg.muted' }>주문번호 { order.orderNum }</Text>
        </Stack>

        <Card.Root width={ 'full' }>
          <Card.Body>
            <Stack gap={ 4 }>
              <SummaryRow
                label={ '주문 상품' }
                value={ order.items.length > 1 ? `${ firstItem.productName } 외 ${ order.items.length - 1 }개` : firstItem.productName }
              />
              <SummaryRow label={ '배송정보' } value={ `${ order.recipientName } · ${ order.shippingAddress }` }/>
              <Separator/>
              <Flex justify={ 'space-between' }>
                <Text fontWeight={ 'semibold' }>주문 금액</Text>
                <Text fontWeight={ 'bold' }>{ formatPrice(order.totalPrice) }</Text>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Stack gap={ 4 } width={ 'full' }>
          <Button size={ 'lg' } onClick={ () => navigate(`/orders/${ order.orderId }`) }>주문 상세 보기</Button>
          <Button size={ 'lg' } variant={ 'outline' } onClick={ () => navigate('/') }>계속 쇼핑하기</Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export const CheckoutPage = () => {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const shippingRef = useRef(null)
  const scrollToShipping = useRef(false)
  const cartIds = state?.cartIds ?? []
  const [items, setItems] = useState(null)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [recipient, setRecipient] = useState({ recipientName: '', recipientPhone: '', postalCode: '', roadAddress: '', detailAddress: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [orderFailure, setOrderFailure] = useState(null)

  const loadItems = () => api.get('/carts')
    .then((response) => {
      setItems(response.data.filter((item) => cartIds.includes(item.cartId)))
      setIsLoadFailed(false)
    })
    .catch(() => setIsLoadFailed(true))

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin')
      return
    }
    if (cartIds.length === 0) {
      navigate('/shopping-cart', { replace: true })
      return
    }

    loadItems()
  }, [isSignedIn, navigate])

  const placeOrder = async () => {
    setIsSubmitted(true)
    if (!recipientFields.every(({ name, isValid }) => isValid(recipient[name]))) {
      setOrderFailure({ type: 'validation', title: '배송 정보를 입력하세요', description: '필수 배송 정보를 확인해 주세요.' })
      return
    }

    setIsOrdering(true)
    const order = {
      recipientName: recipient.recipientName.trim(),
      recipientPhone: recipient.recipientPhone,
      shippingAddress: toShippingAddress(recipient),
    }
    try {
      const { data } = await api.post('/orders', { cartIds: items.map((item) => item.cartId), ...order })
      setCompletedOrder({ ...data, items, ...order })
    } catch (error) {
      const failure = toOrderFailure(error)
      if (failure) {
        setOrderFailure(failure)
      } else {
        toaster.create({ type: 'error', title: error.response?.data?.message ?? '주문하지 못했어요. 다시 시도해 주세요.' })
      }
    }
    setIsOrdering(false)
  }

  if (completedOrder) {
    return (
      <Stack minHeight={ 'vh' } paddingY={ 4 } gap={ 4 } bg={ 'bg' }>
        <Header/>
        <OrderComplete order={ completedOrder }/>
      </Stack>
    )
  }

  const unavailableItems = items?.filter((item) => !item.available) ?? []
  const missingCount = items ? cartIds.filter((cartId) => !items.some((item) => item.cartId === cartId)).length : 0

  if (!items || items.length === 0 || unavailableItems.length > 0 || missingCount > 0) {
    return (
      <Stack minHeight={ 'vh' } paddingY={ 4 } gap={ 4 } bg={ 'bg' }>
        <Header/>
        <Container maxWidth={ '5xl' } paddingY={ 20 } centerContent>
          { isLoadFailed ? (
            <Stack align={ 'center' } gap={ 4 }>
              <Text color={ 'fg.muted' }>주문할 상품을 불러오지 못했어요.</Text>
              <Button variant={ 'outline' } onClick={ loadItems }>다시 시도</Button>
            </Stack>
          ) : items ? (
            <Stack align={ 'center' } gap={ 4 }>
              <Text color={ 'fg.muted' }>
                { items.length > unavailableItems.length ? '주문할 수 없는 상품이 포함되어 있어요.' : '주문할 수 있는 상품이 없어요.' }
              </Text>
              { (unavailableItems.length > 0 || missingCount > 0) && (
                <Stack gap={ 0 } align={ 'center' }>
                  { unavailableItems.map((item) => (
                    <Text key={ item.cartId } textStyle={ 'sm' } color={ 'fg.error' }>
                      { item.productName ?? '판매가 종료된 상품' } · 구매 불가
                    </Text>
                  )) }
                  { missingCount > 0 && (
                    <Text textStyle={ 'sm' } color={ 'fg.error' }>장바구니에서 빠진 상품 { missingCount }개</Text>
                  ) }
                </Stack>
              ) }
              <Button variant={ 'outline' } onClick={ () => navigate('/shopping-cart') }>장바구니에서 다시 선택하기</Button>
            </Stack>
          ) : <Spinner/> }
        </Container>
      </Stack>
    )
  }

  const totalPrice = items.reduce((sum, item) => sum + item.linePrice, 0)

  return (
    <Grid templateRows={ 'auto auto 1fr auto' } minHeight={ 'vh' } paddingY={ 4 } gap={ 4 } bg={ 'bg' }>
      <Header/>

      <Container maxWidth={ '5xl' }>
        <Heading>주문하기</Heading>
      </Container>

      <Container maxWidth={ '5xl' }>
        <Grid templateColumns={ { base: 'minmax(0, 1fr)', lg: '3fr 2fr' } } gap={ 4 } alignItems={ 'start' }>
          <Stack gap={ 4 }>
            <Card.Root bg={ 'bg.panel' }>
              <Card.Body>
                <Stack gap={ 4 }>
                  <Text fontWeight={ 'semibold' }>주문 상품 총 { items.length }개</Text>
                  <Stack gap={ 4 } separator={ <Separator/> }>
                    { items.map((item) => (
                      <Flex key={ item.cartId } gap={ 4 } align={ 'center' }>
                        <Image
                          boxSize={ '16' }
                          objectFit={ 'contain' }
                          rounded={ 'l2' }
                          bg={ 'bg.muted' }
                          src={ item.imageUrl }
                          alt={ item.productName }
                        />
                        <Stack gap={ 0 } minWidth={ 0 } flex={ 1 }>
                          <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ item.brandName }</Text>
                          <Text fontWeight={ 'semibold' } truncate>{ item.productName }</Text>
                          <Text textStyle={ 'sm' } color={ 'fg.muted' }>
                            { [item.color, item.size, `${ item.quantity }개`].filter(Boolean).join(' / ') }
                          </Text>
                        </Stack>
                        <Text fontWeight={ 'bold' } whiteSpace={ 'nowrap' }>{ formatPrice(item.linePrice) }</Text>
                      </Flex>
                    )) }
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>

            <Card.Root ref={ shippingRef } tabIndex={ -1 } bg={ 'bg.panel' }>
              <Card.Body>
                <Stack gap={ 4 }>
                  <Text fontWeight={ 'semibold' }>배송정보</Text>
                  { recipientFields.map(({ name, label, placeholder, inputMode, maxLength, optional, error, isValid, toValue }) => (
                    <Field.Root key={ name } required={ !optional } invalid={ isSubmitted && !isValid(recipient[name]) }>
                      <Field.Label>{ label }</Field.Label>
                      <Input
                        placeholder={ placeholder }
                        inputMode={ inputMode }
                        maxLength={ maxLength }
                        value={ recipient[name] }
                        onChange={ (event) => setRecipient({
                          ...recipient,
                          [name]: toValue ? toValue(event.target) : event.target.value,
                        }) }
                      />
                      <Field.ErrorText>{ error }</Field.ErrorText>
                    </Field.Root>
                  )) }
                </Stack>
              </Card.Body>
            </Card.Root>
          </Stack>

          <Stack gap={ 4 } position={ 'sticky' } top={ 4 } bottom={ 0 } paddingTop={ { base: 4, lg: 0 } } paddingBottom={ 4 } bg={ 'bg' }>
            <Card.Root>
              <Card.Body>
                <Stack gap={ 4 }>
                  <Text fontWeight={ 'semibold' }>주문 금액</Text>
                  <SummaryRow label={ '상품 금액' } value={ formatPrice(totalPrice) }/>
                  <Separator/>
                  <Flex justify={ 'space-between' } align={ 'center' }>
                    <Text color={ 'fg.muted' }>총 주문 금액</Text>
                    <Text textStyle={ 'xl' } fontWeight={ 'bold' }>{ formatPrice(totalPrice) }</Text>
                  </Flex>
                </Stack>
              </Card.Body>
            </Card.Root>

            <Button size={ 'lg' } width={ 'full' } loading={ isOrdering } onClick={ placeOrder }>
              { formatPrice(totalPrice) } 주문하기
            </Button>
            { import.meta.env.DEV && (
              <FailureTestButtons tests={ failureTests }>
                <Button variant={ 'outline' } size={ 'xs' } onClick={ () => setRecipient(testRecipient) }>
                  테스트 정보 채우기
                </Button>
              </FailureTestButtons>
            ) }
          </Stack>
        </Grid>
      </Container>

      <Footer/>
      <Dialog.Root
        open={ !!orderFailure }
        placement={ 'center' }
        size={ 'xs' }
        finalFocusEl={ () => scrollToShipping.current ? shippingRef.current : undefined }
        onOpenChange={ (event) => !event.open && setOrderFailure(null) }
        onExitComplete={ () => {
          if (scrollToShipping.current) {
            shippingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            scrollToShipping.current = false
          }
        } }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{ orderFailure?.title }</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color={ 'fg.muted' }>{ orderFailure?.description }</Text>
              </Dialog.Body>
              <Dialog.Footer>
                { orderFailure?.type === 'validation' ? (
                  <Button flex={ 1 } onClick={ () => {
                    scrollToShipping.current = true
                    setOrderFailure(null)
                  } }>확인</Button>
                ) : (
                  <>
                    <Button variant={ 'outline' } flex={ 1 } onClick={ () => setOrderFailure(null) }>취소</Button>
                    { orderFailure?.type === 'cart' ? (
                      <Button flex={ 1 } onClick={ () => navigate('/shopping-cart') }>장바구니로 돌아가기</Button>
                    ) : (
                      <Button flex={ 1 } onClick={ () => {
                        setOrderFailure(null)
                        placeOrder()
                      } }>다시 시도</Button>
                    ) }
                  </>
                ) }
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Toaster/>
    </Grid>
  )
}
