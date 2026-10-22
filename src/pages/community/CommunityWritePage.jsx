import {
  Button,
  Card,
  Circle,
  Container,
  Flex,
  IconButton,
  Image,
  Input,
  NativeSelect,
  Separator,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { Header } from '../../components/Header.jsx'
import { RichTextEditor } from '/src/components/ui/rich-text-editor'
import { Toaster, toaster } from '../../components/ui/toaster.jsx'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { CATEGORIES, MAX_VOTE_OPTIONS, VOTE_LABELS, errorMessage, optionKey } from './communityFormat.js'
import { CommunityOptionPicker, CommunityOptionSourceSheet } from './CommunityOptionPicker.jsx'
import { CommunityTitleBar } from './CommunityTitleBar.jsx'

const MODES = [
  { value: 'NORMAL', label: '기본' },
  { value: 'VOTE', label: '투표' },
]

const MIN_VOTE_OPTIONS = 2
const VOTE_CATEGORY = 'COORDI_QUESTION'
const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 5000

const toEditorContent = (text) => ({
  type: 'doc',
  content: text.split('\n').map((line) => ({
    type: 'paragraph',
    content: line ? [{ type: 'text', text: line }] : [],
  })),
})

const fromSharedOption = (option) => ({
  source: option.source,
  itemType: option.itemType,
  itemId: option.itemId,
  imageUrl: option.imageUrl ?? option.items?.find((item) => item.imageUrl)?.imageUrl,
  name: option.label,
  price: option.items?.reduce((sum, item) => sum + item.price, 0),
})

const fromVoteOption = ({ source, itemType, itemId, imageUrl, name, price }) => (
  { source, itemType, itemId, imageUrl, name, price }
)

const toRequestOption = ({ source, itemType, itemId, imageUrl }) => ({ source, itemType, itemId, imageUrl })

export const CommunityWritePage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const editingPost = state?.post
  const shared = editingPost ? null : state

  const initialOptions = editingPost
    ? editingPost.voteOptions.map(fromVoteOption)
    : (shared?.voteOptions ?? []).slice(0, MAX_VOTE_OPTIONS).map(fromSharedOption)

  const [mode, setMode] = useState(editingPost?.postType ?? 'NORMAL')
  const [category, setCategory] = useState(editingPost?.category ?? '')
  const [title, setTitle] = useState(editingPost?.title ?? '')
  const [options, setOptions] = useState(initialOptions)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [picker, setPicker] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [pollStarted, setPollStarted] = useState(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: toEditorContent(editingPost?.content ?? ''),
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  })

  const isVote = mode === 'VOTE'
  const isEditing = Boolean(editingPost)
  const canEditOptions = !isEditing || pollStarted === false

  useEffect(() => {
    if (editingPost?.postType !== 'VOTE') {
      return
    }

    api.get(`/community/posts/${ editingPost.postId }/poll`)
      .then((response) => setPollStarted(response.data.total > 0))
      .catch(() => setPollStarted(true))
  }, [editingPost])
  const optionsChanged = options.map(optionKey).join() !== initialOptions.map(optionKey).join()

  const toggleOption = (item) => {
    setOptions((prev) => prev.some((option) => optionKey(option) === optionKey(item))
      ? prev.filter((option) => optionKey(option) !== optionKey(item))
      : [...prev, item].slice(0, MAX_VOTE_OPTIONS))
  }

  const content = editor?.getText({ blockSeparator: '\n' }).trim() ?? ''
  const voteReady = !isVote || (options.length >= MIN_VOTE_OPTIONS && options.length <= MAX_VOTE_OPTIONS)
  const postCategory = isVote ? (editingPost?.category ?? VOTE_CATEGORY) : category
  const canSubmit = title.trim() && content && postCategory && voteReady && content.length <= CONTENT_MAX_LENGTH

  const submit = async () => {
    setSubmitting(true)
    try {
      if (isEditing) {
        await api.patch(`/community/posts/${ editingPost.postId }`, {
          title: title.trim(),
          content,
          category: postCategory,
          ...(isVote && optionsChanged ? { options: options.map(toRequestOption) } : {}),
        })
        navigate(`/community/articles/${ editingPost.postId }`, { replace: true })
        return
      }

      const { data } = await api.post('/community/posts', {
        title: title.trim(),
        content,
        category: postCategory,
        postType: mode,
        ...(isVote ? { options: options.map(toRequestOption) } : {}),
        ...(!isVote && shared?.sharedType ? { sharedType: shared.sharedType, sharedId: shared.sharedId } : {}),
      })
      navigate(`/community/articles/${ data.postId }`, { replace: true })
    } catch (error) {
      toaster.create({ type: 'error', title: errorMessage(error, '게시글을 저장하지 못했어요.') })
    } finally {
      setSubmitting(false)
    }
  }

  const openPicker = (source) => {
    setSheetOpen(false)
    setPicker(source)
  }

  return (
    <Stack direction="column" gap="4" minHeight="100vh" paddingTop="4">
      <Header/>

      <Container maxWidth="3xl" flex="1" display="flex" flexDirection="column">
        <Stack gap="4" flex="1">
          <CommunityTitleBar title={ isEditing ? '게시글 수정' : '커뮤니티' }/>

          { !isEditing && (
            <Tabs.Root fitted variant="plain" value={ mode } onValueChange={ (e) => setMode(e.value) }>
              <Tabs.List>
                { MODES.map((item) => (
                  <Tabs.Trigger
                    key={ item.value }
                    value={ item.value }
                    color="fg.muted"
                    _selected={ { color: 'fg', fontWeight: 'bold' } }
                  >
                    { item.label }
                  </Tabs.Trigger>
                )) }
              </Tabs.List>
            </Tabs.Root>
          ) }

          { picker ? (
            <CommunityOptionPicker
              source={ picker }
              options={ options }
              onToggle={ toggleOption }
              onDone={ () => setPicker(null) }
            />
          ) : (
            <Stack gap="4" flex="1">
              { !isVote && (
                <NativeSelect.Root>
                  <NativeSelect.Field
                    placeholder="카테고리 선택"
                    aria-label="카테고리"
                    value={ category }
                    onChange={ (e) => setCategory(e.target.value) }
                  >
                    { CATEGORIES.map((item) => (
                      <option key={ item.value } value={ item.value }>{ item.label }</option>
                    )) }
                  </NativeSelect.Field>
                  <NativeSelect.Indicator/>
                </NativeSelect.Root>
              ) }

              { isVote && (
                <Stack gap="4">
                  <Text fontWeight="bold">투표 선택지</Text>
                  { options.map((option, index) => (
                    <Card.Root key={ optionKey(option) } size="sm" variant="outline">
                      <Card.Body>
                        <Flex align="center" gap="4">
                          <Circle size="6" bg="fg" color="bg" fontSize="xs" fontWeight="bold" flexShrink="0">
                            { VOTE_LABELS[index] }
                          </Circle>
                          <Image src={ option.imageUrl } alt="" boxSize="12" objectFit="cover" rounded="md" bg="bg.muted"/>
                          <Stack gap="0" flex="1" minWidth="0">
                            <Text fontWeight="bold" lineClamp="1">{ option.name }</Text>
                            { option.price !== null && option.price !== undefined && (
                              <Text fontSize="sm" color="fg.muted">{ option.price.toLocaleString() }원</Text>
                            ) }
                          </Stack>
                          { canEditOptions && (
                            <IconButton
                              variant="ghost"
                              size="sm"
                              aria-label={ `선택지 ${ VOTE_LABELS[index] } 삭제` }
                              onClick={ () => toggleOption(option) }
                            >
                              <LuTrash2/>
                            </IconButton>
                          ) }
                        </Flex>
                      </Card.Body>
                    </Card.Root>
                  )) }
                  { pollStarted && (
                    <Text fontSize="sm" color="fg.muted">투표가 시작돼 선택지는 바꿀 수 없어요.</Text>
                  ) }
                  { canEditOptions && options.length < MAX_VOTE_OPTIONS && (
                    <Button variant="outline" borderStyle="dashed" onClick={ () => setSheetOpen(true) }>
                      <LuPlus/> 선택지 추가 (최대 { MAX_VOTE_OPTIONS }개)
                    </Button>
                  ) }
                  { options.length < MIN_VOTE_OPTIONS && (
                    <Text fontSize="sm" color="fg.muted">선택지를 { MIN_VOTE_OPTIONS }개 이상 골라주세요.</Text>
                  ) }
                </Stack>
              ) }

              <Input
                placeholder="제목"
                aria-label="제목"
                maxLength={ TITLE_MAX_LENGTH }
                value={ title }
                onChange={ (e) => setTitle(e.target.value) }
              />

              <RichTextEditor.Root editor={ editor } minHeight="sm">
                { shared?.snapshot && !isVote && (
                  <Stack gap="4" padding="4" paddingBottom="0">
                    <Text fontWeight="bold">{ shared.sharedType === 'FITTING' ? '공유할 가상 피팅' : '공유할 코디' }</Text>
                    { shared.snapshot.imageUrl && (
                      <Image src={ shared.snapshot.imageUrl } alt="공유할 가상 피팅 결과" maxWidth="xs" bg="bg.muted"/>
                    ) }
                    { shared.snapshot.items.map((item) => (
                      <Flex key={ item.productId } justify="space-between" gap="4">
                        <Text>{ item.productName }</Text>
                        <Text>{ item.price.toLocaleString() }원</Text>
                      </Flex>
                    )) }
                    <Text fontWeight="bold" alignSelf="flex-end">
                      합계 { shared.snapshot.totalPrice.toLocaleString() }원
                    </Text>
                    <Separator/>
                  </Stack>
                ) }
                <RichTextEditor.Content/>
              </RichTextEditor.Root>
              <Text fontSize="xs" color={ content.length > CONTENT_MAX_LENGTH ? 'fg.error' : 'fg.muted' } alignSelf="flex-end">
                { content.length } / { CONTENT_MAX_LENGTH }
              </Text>

              <Stack position="sticky" bottom="0" bg="bg" paddingY="4" marginTop="auto">
                <Button size="lg" disabled={ !canSubmit } loading={ submitting } onClick={ submit }>
                  { isEditing ? '수정하기' : '작성하기' }
                </Button>
              </Stack>
            </Stack>
          ) }
        </Stack>
      </Container>

      <CommunityOptionSourceSheet open={ sheetOpen } onClose={ () => setSheetOpen(false) } onSelect={ openPicker }/>
      <Toaster/>
    </Stack>
  )
}
