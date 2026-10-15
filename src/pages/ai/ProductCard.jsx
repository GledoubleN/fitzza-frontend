import {
  Badge,
  Button,
  createListCollection,
  Flex,
  IconButton,
  Image,
  Portal,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { LuHeart } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import exampleProductImage from '/src/assets/hero.png'
import { api } from '../../api/axios.js'
import { CartAddedDialog } from '../../components/CartAddedDialog.jsx'
import { toaster } from '../../components/ui/toaster.jsx'

// 응답이 오지 않는 요청은 10초 뒤 실패로 처리해 화면이 재시도 안내까지 갈 수 있게 합니다.
const TIMEOUT = { timeout: 10000 }

// 상품 카드 한 칸의 크기. 줄 너비의 2/5를 차지해 다음 카드가 걸쳐 보이게 하되, 너무 작거나 커지지 않게 범위를 둡니다.
// ProductCard가 이 칸을 쓰고, ProductRow의 넘기기 버튼도 사진 높이를 맞추는 데 같은 칸을 씁니다.
export const ProductSlot = (props) => (
  <Flex width={ '2/5' } minWidth={ 32 } maxWidth={ 44 } { ...props }></Flex>
)

// 상품 카드의 색상·사이즈 선택. 가로 스크롤 줄 안에서 목록이 잘리지 않도록 Portal로 띄웁니다.
const OptionSelect = ({ label, placeholder, collection, value, onChange, disabled, hidden }) => (
  <Select.Root
    collection={ collection }
    size={ 'xs' }
    value={ value ? [value] : [] }
    onValueChange={ (e) => onChange(e.value[0] ?? '') }
    disabled={ disabled }
    display={ hidden ? 'none' : undefined }
    // 카드가 많아서, 목록은 펼쳤을 때만 그립니다.
    lazyMount
    unmountOnExit
  >
    <Select.HiddenSelect/>
    <Select.Label srOnly>{ label }</Select.Label>
    <Select.Control>
      <Select.Trigger>
        <Select.ValueText placeholder={ placeholder }/>
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator/>
      </Select.IndicatorGroup>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content>
          {
            collection.items.map((option) => (
              <Select.Item item={ option } key={ option.value }>
                { option.label }
                <Select.ItemIndicator/>
              </Select.Item>
            ))
          }
        </Select.Content>
      </Select.Positioner>
    </Portal>
  </Select.Root>
)

// onOptionChange: 코디 전체 담기를 위해 선택한 옵션을 ComboCard에 전달합니다.
// onTryOn: 있으면 이 상품으로 가상 피팅을 시작하는 버튼을 보여줍니다. tryingOn: 다른 가상 피팅이 진행 중인지.
export const ProductCard = ({ item, onOptionChange, onTryOn, tryingOn }) => {
  const [options, setOptions] = useState([])
  const [color, setColor] = useState('')
  const [optionId, setOptionId] = useState('')
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  const [optionsFailed, setOptionsFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const selectOption = (value) => {
    setOptionId(value)
    onOptionChange?.(item.productId, value)
  }

  // 카드마다 상품 상세를 한 번씩 조회. 느려지면 옵션 일괄 조회 API로 교체.
  useEffect(() => {
    let cancelled = false
    api.get(`/products/${ item.productId }`, TIMEOUT)
      .then(({ data }) => {
        if (cancelled) return
        const options = data.options ?? []
        setOptions(options)
        // 추천 응답에 색상·사이즈가 있으면 바로 선택해둡니다.
        if (options.some((option) => option.color === item.color)) setColor(item.color)
        const recommended = options.find((option) =>
          option.color === item.color && option.size === item.size && option.available)
        if (recommended) selectOption(String(recommended.optionId))
      })
      .catch(() => {
        if (!cancelled) setOptionsFailed(true)
      })
    return () => { cancelled = true }
  }, [item.productId, attempt])

  const retryOptions = () => {
    setOptionsFailed(false)
    setAttempt(attempt + 1)
  }

  const colorCollection = useMemo(() => createListCollection({
    items: [...new Set(options.map((option) => option.color))].map((color) => ({ label: color, value: color })),
  }), [options])

  // 고른 색상에 있는 사이즈만 보여주고, 품절은 고를 수 없게 합니다. 값은 옵션 번호입니다.
  const sizeCollection = useMemo(() => createListCollection({
    items: options.filter((option) => option.color === color).map((option) => ({
      label: option.available ? option.size : `${ option.size } (품절)`,
      value: String(option.optionId),
      disabled: !option.available,
    })),
    isItemDisabled: (item) => item.disabled,
  }), [options, color])

  // 색상을 바꾸면 사이즈를 다시 고르게 합니다.
  const selectColor = (value) => {
    setColor(value)
    selectOption('')
  }

  const submit = async () => {
    setSaving(true)
    try {
      await api.post('/carts', { optionId: Number(optionId), quantity: 1 }, TIMEOUT)
      setAdded(true)
    } catch {
      toaster.create({ type: 'error', title: '장바구니에 담지 못했어요. 다시 시도해주세요.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProductSlot direction={ 'column' } gap={ 2 } position={ 'relative' } flexShrink={ 0 } scrollSnapAlign={ 'start' }>
      <Stack gap={ 1 } flex={ 1 } asChild>
        <Link to={ `/products/${ item.productId }` }>
          <Image
            src={ item.imageUrl || exampleProductImage }
            alt={ item.productName }
            aspectRatio={ 1 }
            objectFit={ 'contain' }
            bg={ 'bg.muted' }
          ></Image>
          <Text fontSize={ 'sm' } lineClamp={ 1 }>{ item.productName }</Text>
          <Text fontSize={ 'sm' } fontWeight={ 'bold' }>{ item.price.toLocaleString() }원</Text>
          {
            item.fitPercent != null &&
            <Badge alignSelf={ 'flex-start' }>핏 { item.fitPercent }%</Badge>
          }
          {
            item.evidence &&
            <Text fontSize={ 'xs' } color={ 'fg.muted' }>{ item.evidence }</Text>
          }
        </Link>
      </Stack>
      {
        optionsFailed &&
        <>
          <Text fontSize={ 'xs' } color={ 'fg.error' }>옵션을 불러오지 못했어요.</Text>
          <Button size={ 'xs' } variant={ 'outline' } onClick={ retryOptions }>다시 시도</Button>
        </>
      }
      <OptionSelect
        label={ `${ item.productName } 색상` }
        placeholder={ '색상' }
        collection={ colorCollection }
        value={ color }
        onChange={ selectColor }
        hidden={ optionsFailed }
      ></OptionSelect>
      <OptionSelect
        label={ `${ item.productName } 사이즈` }
        placeholder={ '사이즈' }
        collection={ sizeCollection }
        value={ optionId }
        onChange={ selectOption }
        disabled={ !color }
        hidden={ optionsFailed }
      ></OptionSelect>
      <Button
        size={ 'xs' }
        variant={ 'outline' }
        display={ optionsFailed ? 'none' : undefined }
        disabled={ !optionId }
        loading={ saving }
        onClick={ submit }
      >
        장바구니 담기
      </Button>
      {
        onTryOn &&
        <Button size={ 'xs' } variant={ 'outline' } disabled={ tryingOn } onClick={ onTryOn }>바로 입어보기</Button>
      }
      <IconButton
        position={ 'absolute' }
        top={ 0 }
        right={ 0 }
        size={ 'sm' }
        variant={ 'ghost' }
        rounded={ 'full' }
        aria-label={ '찜' }
      >
        <LuHeart></LuHeart>
      </IconButton>
      <CartAddedDialog
        open={ added }
        onClose={ () => setAdded(false) }
        description={ item.productName }
      ></CartAddedDialog>
    </ProductSlot>
  )
}
