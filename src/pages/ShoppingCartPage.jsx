import {
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Separator,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Toaster, toaster } from '../components/ui/toaster.jsx'
import { api } from '../api/axios.js'
import { QuantityStepper } from './product/ProductOptionSelector.jsx'
import { CartOptionDialog } from './CartOptionDialog.jsx'

const formatPrice = (price) => `${ price.toLocaleString() }원`

const SelectCheckbox = ({ label, checked, disabled, onChange }) => (
  <Checkbox.Root checked={ checked } disabled={ disabled } onCheckedChange={ (event) => onChange(!!event.checked) }>
    <Checkbox.HiddenInput/>
    <Checkbox.Control/>
    <Checkbox.Label fontWeight={ 'semibold' }>{ label }</Checkbox.Label>
  </Checkbox.Root>
)

export const ShoppingCartPage = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [unselectedIds, setUnselectedIds] = useState(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const loadCart = () => api.get('/carts')
    .then((response) => {
      setItems(response.data)
      setIsLoadFailed(false)
    })
    .catch(() => setIsLoadFailed(true))

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/signin')
      return
    }

    loadCart()
  }, [])

  const updateCart = async (request, failureTitle) => {
    setIsUpdating(true)
    try {
      await request()
    } catch (error) {
      toaster.create({ type: 'error', title: error.response?.data?.message ?? failureTitle })
    }
    await loadCart()
    setIsUpdating(false)
  }

  const changeItem = (item, changes) => updateCart(
    () => api.patch(`/carts/${ item.cartId }`, { optionId: item.optionId, quantity: item.quantity, ...changes }),
    '장바구니를 수정하지 못했어요.',
  )

  const removeItems = (cartIds) => updateCart(
    () => Promise.all(cartIds.map((cartId) => api.delete(`/carts/${ cartId }`))),
    '장바구니에서 삭제하지 못했어요.',
  )

  const changeOption = async (optionId) => {
    await changeItem(editingItem, { optionId })
    setEditingItem(null)
  }

  if (!items) {
    return (
      <Stack minHeight={ '100vh' } paddingY={ 4 } gap={ 4 } bg={ 'bg' }>
        <AppBar/>
        <Container maxWidth={ '5xl' } paddingY={ 20 } centerContent>
          { isLoadFailed ? (
            <Stack align={ 'center' } gap={ 4 }>
              <Text color={ 'fg.muted' }>장바구니를 불러오지 못했어요.</Text>
              <Button variant={ 'outline' } onClick={ loadCart }>다시 시도</Button>
            </Stack>
          ) : <Spinner/> }
        </Container>
      </Stack>
    )
  }

  const availableItems = items.filter((item) => item.available)
  const selectedItems = availableItems.filter((item) => !unselectedIds.has(item.cartId))
  const isAllSelected = availableItems.length > 0 && selectedItems.length === availableItems.length
  const brandGroups = [...Map.groupBy(items, (item) => item.brandName ?? '판매 종료')].map(([brandName, groupItems]) => {
    const groupSelectedItems = groupItems.filter((item) => selectedItems.includes(item))

    return {
      brandName,
      items: groupItems,
      selectableItems: groupItems.filter((item) => item.available),
      selectedItems: groupSelectedItems,
      subtotal: groupSelectedItems.reduce((sum, item) => sum + item.linePrice, 0),
    }
  })
  const totalPrice = brandGroups.reduce((sum, group) => sum + group.subtotal, 0)

  const toggleItems = (targetItems, checked) => setUnselectedIds((current) => {
    const next = new Set(current)
    targetItems.forEach((item) => checked ? next.delete(item.cartId) : next.add(item.cartId))
    return next
  })

  const toggleAll = (checked) => setUnselectedIds(
    checked ? new Set() : new Set(availableItems.map((item) => item.cartId)),
  )

  return (
    <Grid templateRows={ 'auto auto 1fr auto' } minHeight={ '100vh' } paddingY={ 4 } gap={ 4 } bg={ 'bg' }>
      <AppBar/>

      <Container maxWidth={ '5xl' }>
        <Heading>장바구니</Heading>
      </Container>

      <Container maxWidth={ '5xl' }>
        { items.length === 0 ? (
          <Stack align={ 'center' } gap={ 4 } paddingY={ 20 }>
            <Text color={ 'fg.muted' }>장바구니가 비어 있어요.</Text>
            <Button variant={ 'outline' } onClick={ () => navigate('/') }>쇼핑하러 가기</Button>
          </Stack>
        ) : (
          <Grid templateColumns={ { base: 'minmax(0, 1fr)', lg: '3fr 2fr' } } gap={ 4 } alignItems={ 'start' }>
            <Stack gap={ 4 }>
              <Flex justify={ 'space-between' } align={ 'center' }>
                <SelectCheckbox
                  label={ `전체선택 (${ selectedItems.length }/${ availableItems.length })` }
                  checked={ isAllSelected }
                  disabled={ availableItems.length === 0 }
                  onChange={ toggleAll }
                />
                <Button
                  variant={ 'outline' }
                  size={ 'sm' }
                  disabled={ selectedItems.length === 0 || isUpdating }
                  onClick={ () => removeItems(selectedItems.map((item) => item.cartId)) }
                >
                  선택삭제
                </Button>
              </Flex>

              { brandGroups.map((group) => (
                <Card.Root key={ group.brandName } bg={ 'bg.panel' }>
                  <Card.Body>
                    <Stack gap={ 4 }>
                      <SelectCheckbox
                        label={ group.brandName }
                        checked={ group.selectableItems.length > 0 && group.selectedItems.length === group.selectableItems.length }
                        disabled={ group.selectableItems.length === 0 }
                        onChange={ (checked) => toggleItems(group.selectableItems, checked) }
                      />

                      <Stack gap={ 4 } separator={ <Separator/> }>
                        { group.items.map((item) => (
                          <Stack key={ item.cartId } gap={ 4 }>
                            <Flex gap={ 4 } align={ 'start' }>
                              <Checkbox.Root
                                checked={ item.available && !unselectedIds.has(item.cartId) }
                                disabled={ !item.available }
                                onCheckedChange={ (event) => toggleItems([item], !!event.checked) }
                              >
                                <Checkbox.HiddenInput aria-label={ `${ item.productName ?? '상품' } 선택` }/>
                                <Checkbox.Control/>
                              </Checkbox.Root>
                              <Image
                                boxSize={ '20' }
                                objectFit={ 'contain' }
                                rounded={ 'l2' }
                                bg={ 'bg.muted' }
                                src={ item.imageUrl }
                                alt={ item.productName }
                                opacity={ item.available ? 1 : 0.5 }
                              />
                              <Stack gap={ 0 } minWidth={ 0 } flex={ 1 }>
                                <Text fontWeight={ 'semibold' } truncate>
                                  { item.productName ?? '판매가 종료된 상품이에요.' }
                                </Text>
                                { item.color && (
                                  <Text textStyle={ 'sm' } color={ 'fg.muted' }>
                                    { [item.color, item.size].filter(Boolean).join(' / ') }
                                  </Text>
                                ) }
                                { item.available ? (
                                  <Text textStyle={ 'sm' }>{ formatPrice(item.unitPrice) }</Text>
                                ) : (
                                  <Text textStyle={ 'sm' } color={ 'fg.error' }>구매 불가</Text>
                                ) }
                              </Stack>
                              <IconButton
                                variant={ 'ghost' }
                                size={ 'xs' }
                                rounded={ 'full' }
                                aria-label={ '삭제' }
                                disabled={ isUpdating }
                                onClick={ () => removeItems([item.cartId]) }
                              >
                                <LuX/>
                              </IconButton>
                            </Flex>

                            <Flex justify={ 'space-between' } align={ 'center' } gap={ 4 } wrap={ 'wrap' }>
                              <Flex align={ 'center' } gap={ 4 }>
                                <QuantityStepper
                                  quantity={ item.quantity }
                                  disabled={ !item.available || isUpdating }
                                  onChange={ (quantity) => changeItem(item, { quantity }) }
                                />
                                <Button
                                  variant={ 'outline' }
                                  size={ 'sm' }
                                  disabled={ !item.productId || isUpdating }
                                  onClick={ () => setEditingItem(item) }
                                >
                                  옵션 변경
                                </Button>
                              </Flex>
                              <Text fontWeight={ 'bold' } whiteSpace={ 'nowrap' } marginStart={ 'auto' }>
                                { formatPrice(item.linePrice) }
                              </Text>
                            </Flex>
                          </Stack>
                        )) }
                      </Stack>

                      <Separator/>
                      <Flex justify={ 'space-between' }>
                        <Text fontWeight={ 'semibold' }>예상 주문금액</Text>
                        <Text fontWeight={ 'bold' }>{ formatPrice(group.subtotal) }</Text>
                      </Flex>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              )) }
            </Stack>

            <Stack gap={ 4 } position={ 'sticky' } top={ 4 } bottom={ 0 } paddingTop={ { base: 4, lg: 0 } } paddingBottom={ 4 } bg={ 'bg' }>
              <Card.Root>
                <Card.Body>
                  <Flex justify={ 'space-between' } align={ 'center' }>
                    <Text color={ 'fg.muted' }>총 주문 금액</Text>
                    <Text textStyle={ 'xl' } fontWeight={ 'bold' }>{ formatPrice(totalPrice) }</Text>
                  </Flex>
                </Card.Body>
              </Card.Root>

              <Button
                size={ 'lg' }
                width={ 'full' }
                disabled={ selectedItems.length === 0 || isUpdating }
                onClick={ () => navigate('/checkout', { state: { cartIds: selectedItems.map((item) => item.cartId) } }) }
              >
                주문하기 { selectedItems.length }
              </Button>
            </Stack>
          </Grid>
        ) }
      </Container>

      <Footer/>

      { editingItem && (
        <CartOptionDialog item={ editingItem } onClose={ () => setEditingItem(null) } onSubmit={ changeOption }/>
      ) }
      <Toaster/>
    </Grid>
  )
}
