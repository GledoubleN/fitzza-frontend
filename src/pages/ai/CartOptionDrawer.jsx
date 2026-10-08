import { Button, CloseButton, Drawer, Field, NativeSelect, Portal, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toaster } from '../../components/ui/toaster.jsx'
import { addToCart, getProductOptions } from './aiApi.js'

// 코디의 상품별 옵션을 고른 뒤 한 번에 장바구니에 담는다.
export const CartOptionDrawer = ({ combo, onClose }) => {
  const [options, setOptions] = useState(null)
  const [selected, setSelected] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!combo) return
    let cancelled = false
    setOptions(null)
    setSelected({})
    setError('')
    Promise.all(combo.items.map((item) => getProductOptions(item.productId)))
      .then((lists) => {
        if (cancelled) return
        setOptions(Object.fromEntries(combo.items.map((item, i) => [item.productId, lists[i]])))
      })
      .catch(() => {
        if (!cancelled) setError('옵션을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      })
    return () => { cancelled = true }
  }, [combo])

  const allSelected = combo?.items.every((item) => selected[item.productId])

  const submit = async () => {
    setSaving(true)
    try {
      await Promise.all(combo.items.map((item) => addToCart(Number(selected[item.productId]))))
      toaster.create({ type: 'success', title: '장바구니에 담았어요' })
      onClose()
    } catch {
      toaster.create({ type: 'error', title: '장바구니에 담지 못했어요. 다시 시도해주세요.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer.Root
      open={ !!combo }
      placement={ 'bottom' }
      onOpenChange={ (e) => { if (!e.open) onClose() } }
    >
      <Portal>
        <Drawer.Backdrop/>
        <Drawer.Positioner>
          <Drawer.Content roundedTop={ '2xl' }>
            <Drawer.Header>
              <Drawer.Title>옵션 선택</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              { error && <Text color={ 'fg.error' }>{ error }</Text> }
              { !error && !options && <Spinner size={ 'sm' }></Spinner> }
              {
                combo && options &&
                <Stack gap={ 4 }>
                  {
                    combo.items.map((item) => (
                      <Field.Root key={ item.productId }>
                        <Field.Label>{ item.productName }</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            placeholder={ '색상 / 사이즈' }
                            value={ selected[item.productId] ?? '' }
                            onChange={ (e) => setSelected({ ...selected, [item.productId]: e.target.value }) }
                          >
                            {
                              options[item.productId].map((option) => (
                                <option key={ option.optionId } value={ option.optionId } disabled={ !option.available }>
                                  { option.color } / { option.size }{ option.available ? '' : ' (품절)' }
                                </option>
                              ))
                            }
                          </NativeSelect.Field>
                          <NativeSelect.Indicator/>
                        </NativeSelect.Root>
                      </Field.Root>
                    ))
                  }
                </Stack>
              }
            </Drawer.Body>
            <Drawer.Footer>
              <Button width={ '100%' } disabled={ !allSelected } loading={ saving } onClick={ submit }>
                장바구니 담기
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size={ 'sm' }></CloseButton>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
