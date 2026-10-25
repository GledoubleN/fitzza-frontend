import { useId, useState } from 'react'
import { Box, createListCollection, Flex, IconButton, Input, Portal, Select, Stack, Text } from '@chakra-ui/react'
import { LuCheck, LuEraser, LuPencil, LuX } from 'react-icons/lu'

export const ProfileFieldEditor = ({ label, value, unit, options, onSave, disabled = false }) => {
  const inputId = useId()
  const collection = createListCollection({ items: options ?? [] })
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const selectedOption = options?.find(option => option.value === value || option.label === value)
  const selectedLabel = selectedOption?.label ?? value
  const hasValue = value !== '' && value !== null && value !== undefined

  const startEditing = () => {
    setDraft(selectedOption?.value ?? String(value ?? ''))
    setError('')
    setIsSaved(false)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (isSaving) return
    setIsEditing(false)
    setError('')
  }

  const save = async (event) => {
    event.preventDefault()
    if (!isEditing || isSaving) return
    setIsSaving(true)
    setError('')

    try {
      await onSave(draft)
      setIsEditing(false)
      setIsSaved(true)
    } catch (error) {
      setError(error.response?.data?.message || '저장하지 못했어요. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Stack
      as="form"
      gap={ 4 }
      padding={ 4 }
      rounded="2xl"
      minWidth={ 0 }
      borderWidth="thin"
      borderColor={ isEditing ? 'primary.solid' : 'border.subtle' }
      bg={ isEditing ? 'bg.panel' : 'bg.subtle' }
      onSubmit={ save }
      onKeyDown={ event => {
        if (event.key === 'Escape' && !event.defaultPrevented) cancelEditing()
      } }
    >
      <Flex
        align="center"
        justify="space-between"
        height={ 8 }
        gap={ 0 }
      >
        <Text
          as="label"
          htmlFor={ inputId }
          textStyle="sm"
          color="fg.muted"
        >
          { label }
        </Text>
        { isEditing ? (
          <Text
            textStyle="xs"
            color="primary.fg"
          >
            수정 중
          </Text>
        ) : (
          <IconButton
            type="button"
            size="xs"
            variant="ghost"
            rounded="full"
            aria-label={ `${ label } 수정` }
            disabled={ disabled }
            onClick={ startEditing }
          >
            <LuPencil/>
          </IconButton>
        ) }
      </Flex>
      <Flex
        height={ 12 }
        align="center"
        minWidth={ 0 }
      >
        { isEditing ? options ? (
          <Select.Root
            collection={ collection }
            ids={ { trigger: inputId } }
            size="md"
            width="full"
            disabled={ isSaving }
            invalid={ !!error }
            value={ [draft] }
            onValueChange={ event => setDraft(event.value[0] ?? '') }
          >
            <Select.HiddenSelect/>
            <Select.Control>
              <Select.Trigger
                height={ 12 }
                aria-label={ label }
                aria-describedby={ `${ inputId }-status` }
                autoFocus
              >
                <Select.ValueText placeholder="선택 안함"/>
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator/>
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  { collection.items.map(option => (
                    <Select.Item
                      key={ option.value }
                      item={ option }
                    >
                      <Select.ItemText>{ option.label }</Select.ItemText>
                      <Select.ItemIndicator/>
                    </Select.Item>
                  )) }
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        ) : (
          <Input
            id={ inputId }
            value={ draft }
            onChange={ event => setDraft(event.target.value.replace(/[^0-9]/g, '')) }
            inputMode="numeric"
            maxLength={ 3 }
            placeholder={ unit }
            height={ 12 }
            disabled={ isSaving }
            aria-invalid={ !!error }
            aria-describedby={ `${ inputId }-status` }
            autoFocus
          />
        ) : (
          <Text
            textStyle="xl"
            fontWeight="600"
            color={ hasValue ? 'fg' : 'fg.muted' }
            truncate
          >
            { hasValue ? selectedLabel : '아직 미입력' }
            { hasValue && unit && (
              <Box
                as="span"
                marginLeft={ 4 }
                textStyle="sm"
                fontWeight="400"
                color="fg.muted"
              >
                { unit }
              </Box>
            ) }
          </Text>
        ) }
      </Flex>
      <Flex
        height={ 8 }
        align="center"
        justify="space-between"
        gap={ 0 }
      >
        { isEditing ? (
          <>
            <IconButton
              type="button"
              size="xs"
              variant="ghost"
              aria-label={ `${ label } 비우기` }
              title="비우기"
              disabled={ isSaving }
              onClick={ () => setDraft('') }
            >
              <LuEraser/>
            </IconButton>
            <Flex gap={ 0 }>
              <IconButton
                type="button"
                size="xs"
                variant="ghost"
                aria-label={ `${ label } 수정 취소` }
                title="취소"
                disabled={ isSaving }
                onClick={ cancelEditing }
              >
                <LuX/>
              </IconButton>
              <IconButton
                type="submit"
                size="xs"
                colorPalette="primary"
                loading={ isSaving }
                aria-label={ `${ label } 저장` }
                title="저장"
              >
                <LuCheck/>
              </IconButton>
            </Flex>
          </>
        ) : (
          <Text
            textStyle="xs"
            color="fg.muted"
            truncate
          >
            { hasValue ? '언제든 수정할 수 있어요' : '입력하면 추천이 더 정확해져요' }
          </Text>
        ) }
      </Flex>
      <Text
        id={ `${ inputId }-status` }
        aria-live="polite"
        minHeight={ 4 }
        textStyle="xs"
        color={ error ? 'fg.error' : 'fg.success' }
        title={ error || undefined }
        truncate
      >
        { error || (isSaved ? '저장했어요' : '') }
      </Text>
    </Stack>
  )
}