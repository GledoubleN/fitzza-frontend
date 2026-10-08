import { Badge, Button, IconButton, Image, NativeSelect, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuHeart } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import exampleProductImage from '/src/assets/hero.png'
import { toaster } from '../../components/ui/toaster.jsx'
import { addToCart, getProductOptions } from './aiApi.js'

// onOptionChange: 코디 전체 담기를 위해 선택한 옵션을 부모에 알린다.
export const ProductCard = ({ item, onOptionChange }) => {
  const [options, setOptions] = useState([])
  const [color, setColor] = useState('')
  const [optionId, setOptionId] = useState('')
  const [saving, setSaving] = useState(false)
  const [optionsFailed, setOptionsFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const selectOption = (value) => {
    setOptionId(value)
    onOptionChange?.(item.productId, value)
  }

  // ponytail: 카드마다 상품 상세를 한 번씩 조회. 느려지면 옵션 일괄 조회 API로 교체.
  useEffect(() => {
    let cancelled = false
    getProductOptions(item.productId)
      .then((options) => {
        if (cancelled) return
        setOptions(options)
        // 추천 응답에 색상·사이즈가 있으면 바로 선택해 둔다.
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

  const colors = [...new Set(options.map((option) => option.color))]

  // 색상을 바꾸면 사이즈를 다시 고르게 한다.
  const selectColor = (value) => {
    setColor(value)
    selectOption('')
  }

  const submit = async () => {
    setSaving(true)
    try {
      await addToCart(Number(optionId))
      toaster.create({ type: 'success', title: `${ item.productName }을(를) 장바구니에 담았어요` })
    } catch {
      toaster.create({ type: 'error', title: '장바구니에 담지 못했어요. 다시 시도해주세요.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack gap={ 2 } position={ 'relative' } width={ 36 } flexShrink={ 0 }>
      <Stack gap={ 1 } flex={ 1 } asChild>
        <Link to={ `/products/${ item.productId }` }>
          <Image
            src={ item.imageUrl || exampleProductImage }
            alt={ item.productName }
            aspectRatio={ 1 }
            objectFit={ 'cover' }
            rounded={ 'md' }
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
      <NativeSelect.Root size={ 'xs' } display={ optionsFailed ? 'none' : undefined }>
        <NativeSelect.Field
          placeholder={ '색상' }
          aria-label={ `${ item.productName } 색상` }
          value={ color }
          onChange={ (e) => selectColor(e.target.value) }
        >
          {
            colors.map((color) => (
              <option key={ color } value={ color }>{ color }</option>
            ))
          }
        </NativeSelect.Field>
        <NativeSelect.Indicator/>
      </NativeSelect.Root>
      <NativeSelect.Root size={ 'xs' } disabled={ !color } display={ optionsFailed ? 'none' : undefined }>
        <NativeSelect.Field
          placeholder={ '사이즈' }
          aria-label={ `${ item.productName } 사이즈` }
          value={ optionId }
          onChange={ (e) => selectOption(e.target.value) }
        >
          {
            options.filter((option) => option.color === color).map((option) => (
              <option key={ option.optionId } value={ option.optionId } disabled={ !option.available }>
                { option.size }{ option.available ? '' : ' (품절)' }
              </option>
            ))
          }
        </NativeSelect.Field>
        <NativeSelect.Indicator/>
      </NativeSelect.Root>
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
    </Stack>
  )
}
