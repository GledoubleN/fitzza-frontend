import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  Image,
  Input,
  NativeSelect,
  Separator,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { Header } from '../../components/Header.jsx'
import { RichTextEditor } from '/src/components/ui/rich-text-editor'
import { Toaster, toaster } from '../../components/ui/toaster.jsx'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { CATEGORIES, errorMessage } from './communityFormat.js'

const MODES = [
  { value: 'NORMAL', label: '기본' },
  { value: 'VOTE', label: '투표' },
]

const MIN_VOTE_OPTIONS = 2
const MAX_VOTE_OPTIONS = 4
const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 5000

const toEditorContent = (text) => ({
  type: 'doc',
  content: text.split('\n').map((line) => ({
    type: 'paragraph',
    content: line ? [{ type: 'text', text: line }] : [],
  })),
})

const fromWishlistItem = (item) => ({
  key: `WISHLIST-${ item.itemId ?? item.productId }`,
  source: 'WISHLIST',
  itemType: 'PRODUCT',
  itemId: item.itemId ?? item.productId,
  imageUrl: item.imageUrl ?? item.thumbnailUrl,
  name: item.name ?? item.productName,
})

const fromSharedOption = (option) => ({
  key: `${ option.source }-${ option.itemId }`,
  source: option.source,
  itemType: option.itemType,
  itemId: option.itemId,
  imageUrl: option.imageUrl ?? option.items?.find((item) => item.imageUrl)?.imageUrl,
  name: option.label,
  items: option.items,
})

export const CommunityWritePage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const editingPost = state?.post
  const shared = editingPost ? null : state

  const [mode, setMode] = useState(editingPost?.postType ?? 'NORMAL')
  const [category, setCategory] = useState(editingPost?.category ?? '')
  const [title, setTitle] = useState(editingPost?.title ?? '')
  const [candidates, setCandidates] = useState(() => (shared?.voteOptions ?? []).map(fromSharedOption))
  const [selectedKeys, setSelectedKeys] = useState(() => candidates.slice(0, MAX_VOTE_OPTIONS).map((option) => option.key))
  const [submitting, setSubmitting] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: toEditorContent(editingPost?.content ?? ''),
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  })

  const isVote = mode === 'VOTE'
  const isEditing = Boolean(editingPost)

  useEffect(() => {
    if (!isVote || isEditing) {
      return
    }

    api.get('/wishlists')
      .then((response) => {
        const wishlist = response.data.content.map(fromWishlistItem)
        setCandidates((prev) => [...prev, ...wishlist.filter((item) => !prev.some((option) => option.key === item.key))])
      })
      .catch((error) => toaster.create({ type: 'error', title: errorMessage(error, '찜 목록을 불러오지 못했어요.') }))
  }, [isVote, isEditing])

  const toggleCandidate = (key) => {
    setSelectedKeys((prev) => prev.includes(key)
      ? prev.filter((selected) => selected !== key)
      : [...prev, key])
  }

  const content = editor?.getText({ blockSeparator: '\n' }).trim() ?? ''
  const voteOptionCount = selectedKeys.length
  const voteReady = !isVote || isEditing || (voteOptionCount >= MIN_VOTE_OPTIONS && voteOptionCount <= MAX_VOTE_OPTIONS)
  const canSubmit = title.trim() && content && category && voteReady && content.length <= CONTENT_MAX_LENGTH

  const submit = async () => {
    setSubmitting(true)
    try {
      if (isEditing) {
        await api.patch(`/community/posts/${ editingPost.postId }`, { title: title.trim(), content, category })
        navigate(`/community/articles/${ editingPost.postId }`, { replace: true })
        return
      }

      const options = selectedKeys
        .map((key) => candidates.find((option) => option.key === key))
        .map(({ source, itemType, itemId, imageUrl }) => ({ source, itemType, itemId, imageUrl }))
      const { data } = await api.post('/community/posts', {
        title: title.trim(),
        content,
        category,
        postType: mode,
        ...(isVote ? { options } : {}),
        ...(!isVote && shared?.sharedType ? { sharedType: shared.sharedType, sharedId: shared.sharedId } : {}),
      })
      navigate(`/community/articles/${ data.postId }`, { replace: true })
    } catch (error) {
      toaster.create({ type: 'error', title: errorMessage(error, '게시글을 저장하지 못했어요.') })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack direction="column" gap="4" minHeight="100vh" paddingY="4">
      <Header/>

      <Container maxWidth="3xl" paddingBottom="8">
        <Stack gap="4">
          <Text fontSize="lg" fontWeight="bold">{ isEditing ? '게시글 수정' : '글쓰기' }</Text>

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

          { isVote && !isEditing && (
            <Stack gap="4">
              <Text fontSize="sm" color="fg.muted">
                투표 선택지를 { MIN_VOTE_OPTIONS }~{ MAX_VOTE_OPTIONS }개 골라주세요. ({ voteOptionCount }개 선택)
              </Text>
              { candidates.length === 0 && (
                <Text fontSize="sm" color="fg.muted">찜한 상품이 없어요. 상품을 찜하면 선택지로 쓸 수 있어요.</Text>
              ) }
              <Grid templateColumns={ { base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' } } gap="4">
                { candidates.map((option) => {
                  const checked = selectedKeys.includes(option.key)
                  const disabled = !checked && voteOptionCount >= MAX_VOTE_OPTIONS

                  return (
                    <Checkbox.Root
                      key={ option.key }
                      checked={ checked }
                      disabled={ disabled }
                      onCheckedChange={ () => toggleCandidate(option.key) }
                      display="block"
                    >
                      <Checkbox.HiddenInput aria-label={ option.name }/>
                      <Card.Root
                        size="sm"
                        overflow="hidden"
                        cursor={ disabled ? 'not-allowed' : 'pointer' }
                        opacity={ disabled ? '0.5' : '1' }
                        borderColor={ checked ? 'primary.solid' : 'border' }
                      >
                        <Box position="relative">
                          <Image src={ option.imageUrl } alt="" aspectRatio="square" width="full" objectFit="cover" bg="bg.muted"/>
                          <Checkbox.Control position="absolute" top="2" left="2" bg="bg"/>
                        </Box>
                        <Card.Body>
                          <Checkbox.Label fontSize="sm" lineClamp="1">{ option.name }</Checkbox.Label>
                        </Card.Body>
                      </Card.Root>
                    </Checkbox.Root>
                  )
                }) }
              </Grid>
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

          <Button colorPalette="primary" disabled={ !canSubmit } loading={ submitting } onClick={ submit }>
            { isEditing ? '수정하기' : '작성하기' }
          </Button>
        </Stack>
      </Container>
      <Toaster/>
    </Stack>
  )
}
