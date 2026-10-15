import { useEffect, useState } from 'react'
import { Button, Dialog, Portal, Spinner, Stack, Text, createListCollection } from '@chakra-ui/react'
import { api } from '../api/axios.js'
import { OptionSelect } from './product/ProductOptionSelector.jsx'

export const CartOptionDialog = ({ item, onClose, onSubmit }) => {
  const [options, setOptions] = useState(null)
  const [color, setColor] = useState(item.color ?? '')
  const [size, setSize] = useState(item.size ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ignore = false
    api.get(`/products/${ item.productId }`)
      .then((response) => !ignore && setOptions(response.data.options ?? []))
      .catch(() => !ignore && setOptions([]))

    return () => { ignore = true }
  }, [item.productId])

  const colors = [...new Set((options ?? []).map((option) => option.color).filter(Boolean))]
  const sizeOptions = (options ?? []).filter((option) => colors.length === 0 || option.color === color)
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
  const selectedOption = sizeOptions.find((option) => option.size === size)
  const isSoldOut = selectedOption?.available === false

  const submit = async () => {
    setIsSubmitting(true)
    await onSubmit(selectedOption.optionId)
    setIsSubmitting(false)
  }

  return (
    <Dialog.Root open placement={ 'center' } size={ 'sm' } onOpenChange={ (event) => !event.open && onClose() }>
      <Portal>
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>옵션 변경</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              { options === null ? <Spinner/> : options.length === 0 ? (
                <Text color={ 'fg.muted' }>옵션을 불러오지 못했어요.</Text>
              ) : (
                <Stack gap={ 4 }>
                  <Text fontWeight={ 'semibold' }>{ item.productName }</Text>
                  { colors.length > 0 && (
                    <OptionSelect
                      label={ '색상' }
                      collection={ colorCollection }
                      value={ color ? [color] : [] }
                      onValueChange={ (event) => setColor(event.value[0] ?? '') }
                    />
                  ) }
                  <OptionSelect
                    label={ '사이즈' }
                    collection={ sizeCollection }
                    disabled={ sizeOptions.length === 0 }
                    value={ selectedOption ? [String(selectedOption.optionId)] : [] }
                    onValueChange={ (event) => setSize(
                      sizeOptions.find((option) => String(option.optionId) === event.value[0])?.size ?? '',
                    ) }
                  />
                  { (!selectedOption || isSoldOut) && (
                    <Text textStyle={ 'sm' } color={ 'fg.error' }>
                      { isSoldOut ? '품절된 상품입니다. 다른 사이즈를 선택해 주세요.' : '사이즈를 선택해 주세요.' }
                    </Text>
                  ) }
                </Stack>
              ) }
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant={ 'outline' } flex={ 1 } onClick={ onClose }>취소</Button>
              <Button
                flex={ 1 }
                disabled={ !selectedOption || isSoldOut || selectedOption.optionId === item.optionId }
                loading={ isSubmitting }
                onClick={ submit }
              >
                변경하기
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
