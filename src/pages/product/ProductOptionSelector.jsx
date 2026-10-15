import { useState } from 'react'
import { Button, Flex, IconButton, Portal, Select, Stack, Text, createListCollection } from '@chakra-ui/react'
import { LuMinus, LuPlus, LuX } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'

// 옵션 구조는 명세에 열려 있어 { optionId, color, size, available }로 가정한다.
const getOptionLabel = (option) => [option.color, option.size].filter(Boolean).join(' / ')

export const OptionSelect = ({ label, collection, ...props }) => (
  <Select.Root collection={ collection } width={ '100%' } { ...props }>
    <Select.HiddenSelect/>
    <Select.Control>
      <Select.Trigger aria-label={ label }>
        <Select.ValueText placeholder={ label }/>
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator/>
      </Select.IndicatorGroup>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content>
          { collection.items.map((item) => (
            <Select.Item item={ item } key={ item.value }>
              { item.label }
              <Select.ItemIndicator/>
            </Select.Item>
          )) }
        </Select.Content>
      </Select.Positioner>
    </Portal>
  </Select.Root>
)

export const QuantityStepper = ({ quantity, onChange, disabled }) => (
  <Flex align={ 'center' } gap={ 4 } bg={ 'bg' } border={ 'sm' } borderColor={ 'border' } rounded={ 'l2' }>
    <IconButton
      variant={ 'ghost' }
      size={ 'sm' }
      aria-label={ '수량 줄이기' }
      disabled={ disabled || quantity <= 1 }
      onClick={ () => onChange(quantity - 1) }
    >
      <LuMinus/>
    </IconButton>
    <Text fontWeight={ 'bold' }>{ quantity }</Text>
    <IconButton
      variant={ 'ghost' }
      size={ 'sm' }
      aria-label={ '수량 늘리기' }
      disabled={ disabled }
      onClick={ () => onChange(quantity + 1) }
    >
      <LuPlus/>
    </IconButton>
  </Flex>
)

export const ProductOptionSelector = ({ product }) => {
  const navigate = useNavigate()
  const [color, setColor] = useState('')
  // { [optionId]: 수량 }
  const [quantities, setQuantities] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddedDialogOpen, setIsAddedDialogOpen] = useState(false)

  const options = product.options ?? []
  const colors = [...new Set(options.map((option) => option.color).filter(Boolean))]
  const sizeOptions = colors.length > 0
    ? options.filter((option) => option.color === color)
    : options
  const colorCollection = createListCollection({
    items: colors.map((item) => ({ label: item, value: item })),
  })
  const sizeCollection = createListCollection({
    items: sizeOptions.map((option) => ({
      label: option.available === false ? `${ option.size } (품절)` : option.size,
      value: String(option.optionId),
      disabled: option.available === false,
    })),
  })
  const selectedOptions = options.filter((option) => quantities[option.optionId])
  const totalQuantity = selectedOptions.reduce((sum, option) => sum + quantities[option.optionId], 0)

  const setQuantity = (optionId, quantity) => {
    setQuantities(({ [optionId]: _removed, ...rest }) => (
      quantity > 0 ? { ...rest, [optionId]: quantity } : rest
    ))
  }

  const addToCart = async () => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/signin')
      return
    }

    setIsSubmitting(true)
    const results = await Promise.allSettled(selectedOptions.map((option) => (
      api.post('/carts', { optionId: option.optionId, quantity: quantities[option.optionId] })
    )))
    setIsSubmitting(false)

    // 담긴 옵션은 목록에서 빼고 실패한 옵션만 남겨, 재시도해도 수량이 중복으로 더해지지 않게 한다.
    const failedOptions = selectedOptions.filter((_, index) => results[index].status === 'rejected')
    setQuantities(Object.fromEntries(
      failedOptions.map((option) => [option.optionId, quantities[option.optionId]]),
    ))

    if (failedOptions.length > 0) {
      toaster.create({
        type: 'error',
        title: failedOptions.length < selectedOptions.length
          ? '일부 옵션을 담지 못했어요. 남은 옵션을 다시 시도해 주세요.'
          : '장바구니에 담지 못했어요. 다시 시도해 주세요.',
      })
      return
    }

    setIsAddedDialogOpen(true)
  }

  return (
    <Stack gap={ 4 }>
      { colors.length > 0 && (
        <OptionSelect
          label={ '색상' }
          collection={ colorCollection }
          value={ color ? [color] : [] }
          onValueChange={ (event) => setColor(event.value[0] ?? '') }
        />
      ) }
      {/* 고를 때마다 선택 목록에 추가하고 값은 비워 둔다. */ }
      <OptionSelect
        label={ '사이즈' }
        collection={ sizeCollection }
        disabled={ sizeOptions.length === 0 }
        value={ [] }
        onValueChange={ (event) => event.value[0] && setQuantity(event.value[0], quantities[event.value[0]] ?? 1) }
      />

      { selectedOptions.map((option) => (
        <Stack key={ option.optionId } bg={ 'bg.muted' } rounded={ 'l2' } padding={ 4 } gap={ 3 }>
          <Flex justify={ 'space-between' } align={ 'center' }>
            <Text fontWeight={ 'bold' }>{ getOptionLabel(option) }</Text>
            <IconButton
              variant={ 'ghost' }
              size={ 'xs' }
              aria-label={ '선택 삭제' }
              onClick={ () => setQuantity(option.optionId, 0) }
            >
              <LuX/>
            </IconButton>
          </Flex>
          <Flex justify={ 'space-between' } align={ 'center' }>
            <QuantityStepper
              quantity={ quantities[option.optionId] }
              onChange={ (quantity) => setQuantity(option.optionId, quantity) }
            />
            <Text fontWeight={ 'bold' }>
              { (product.price * quantities[option.optionId]).toLocaleString() }원
            </Text>
          </Flex>
        </Stack>
      )) }

      <Flex justify={ 'space-between' } align={ 'center' }>
        <Text color={ 'fg.muted' }>총 상품 금액</Text>
        <Text textStyle={ 'xl' } fontWeight={ 'bold' }>
          { (product.price * totalQuantity).toLocaleString() }원
        </Text>
      </Flex>

      <Button
        size={ 'lg' }
        disabled={ totalQuantity === 0 }
        loading={ isSubmitting }
        onClick={ addToCart }
      >
        장바구니
      </Button>
      { totalQuantity === 0 && (
        <Text textStyle={ 'sm' } color={ 'fg.muted' } textAlign={ 'center' }>
          { colors.length > 0 && !color ? '색상을 먼저 선택해 주세요.' : '사이즈를 선택해 주세요.' }
        </Text>
      ) }

      <CartAddedDialog open={ isAddedDialogOpen } onClose={ () => setIsAddedDialogOpen(false) }/>
    </Stack>
  )
}
