import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Drawer,
  Flex,
  Grid,
  IconButton,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight, LuHeart, LuSparkles } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { MAX_VOTE_OPTIONS, errorMessage, formatRelativeTime, optionKey } from './communityFormat.js'
import { CommunityConfirmDialog } from './CommunityConfirmDialog.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

const RECOMMENDATION_PAGE_SIZE = 10

const PLACEHOLDER_IMAGE = '/product-image.png'

const fromWishlistItem = (item) => ({
  source: 'WISHLIST',
  itemType: 'PRODUCT',
  itemId: item.itemId ?? item.productId,
  imageUrl: item.imageUrl ?? item.thumbnailUrl,
  name: item.name ?? item.productName,
  price: item.price,
})

const fromRecommendedItem = (item) => ({
  source: 'AI_RECOMMEND',
  itemType: 'PRODUCT',
  itemId: item.productId,
  imageUrl: item.imageUrl || PLACEHOLDER_IMAGE,
  name: item.productName,
  price: item.price,
})

const recommendedProducts = (recommendation) => {
  const products = [
    ...(recommendation.items ?? []),
    ...(recommendation.combos ?? []).flatMap((combo) => combo.items ?? []),
  ]

  return products
    .filter((product, index) => products.findIndex((other) => other.productId === product.productId) === index)
    .map(fromRecommendedItem)
}

const SOURCES = [
  { value: 'AI', icon: LuSparkles, title: 'AI 추천에서 가져오기', description: 'AI 스타일리스트가 추천했던 상품' },
  { value: 'WISHLIST', icon: LuHeart, title: '찜에서 가져오기', description: '찜한 상품' },
]

export const CommunityOptionSourceSheet = ({ open, onClose, onSelect }) => (
  <Drawer.Root open={ open } placement="bottom" onOpenChange={ (e) => !e.open && onClose() }>
    <Portal>
      <Drawer.Backdrop/>
      <Drawer.Positioner>
        <Drawer.Content roundedTop="xl">
          <Drawer.Header>
            <Drawer.Title>투표에 올릴 상품 가져오기</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body paddingBottom="8">
            <Stack gap="4">
              { SOURCES.map(({ value, icon: Icon, title, description }) => (
                <Flex
                  key={ value }
                  as="button"
                  gap="4"
                  align="center"
                  textAlign="start"
                  onClick={ () => onSelect(value) }
                >
                  <Flex boxSize="10" rounded="full" bg="bg.muted" align="center" justify="center" flexShrink="0">
                    <Icon/>
                  </Flex>
                  <Stack gap="0" flex="1">
                    <Text fontWeight="bold">{ title }</Text>
                    <Text fontSize="sm" color="fg.muted">{ description }</Text>
                  </Stack>
                  <LuChevronRight/>
                </Flex>
              )) }
            </Stack>
          </Drawer.Body>
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm"/>
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  </Drawer.Root>
)

export const CommunityOptionPicker = ({ source, options, onToggle, onDone }) => {
  const isAI = source === 'AI'

  return (
    <Stack gap="4">
      <Flex align="center" gap="4">
        <IconButton variant="ghost" size="sm" aria-label="작성으로 돌아가기" onClick={ onDone }>
          <LuChevronLeft/>
        </IconButton>
        <Text flex="1" textAlign="center" fontSize="lg" fontWeight="bold">
          { isAI ? 'AI 추천에서 가져오기' : '찜에서 가져오기' }
        </Text>
        <Box boxSize="8"/>
      </Flex>

      { isAI
        ? <RecommendationGroups options={ options } onToggle={ onToggle }/>
        : <WishlistGrid options={ options } onToggle={ onToggle }/> }

      <Flex
        position="sticky"
        bottom="0"
        bg="bg"
        paddingY="4"
        borderTopWidth="sm"
        gap="4"
        align="center"
      >
        <Stack gap="0">
          <Text fontWeight="bold">{ options.length } / { MAX_VOTE_OPTIONS }</Text>
          <Text fontSize="xs" color="fg.muted">최대 { MAX_VOTE_OPTIONS }개</Text>
        </Stack>
        <Button flex="1" size="lg" onClick={ onDone }>선택 완료</Button>
      </Flex>
    </Stack>
  )
}

const WishlistGrid = ({ options, onToggle }) => {
  const [items, setItems] = useState(null)

  useEffect(() => {
    api.get('/wishlists')
      .then((response) => setItems(response.data.content.map(fromWishlistItem)))
      .catch((error) => {
        setItems([])
        toaster.create({ type: 'error', title: errorMessage(error, '찜 목록을 불러오지 못했어요.') })
      })
  }, [])

  if (!items) {
    return <Text color="fg.muted">불러오는 중...</Text>
  }
  if (items.length === 0) {
    return <Text color="fg.muted">찜한 상품이 없어요. 상품을 찜하면 선택지로 쓸 수 있어요.</Text>
  }

  return <OptionGrid items={ items } options={ options } onToggle={ onToggle }/>
}

const RecommendationGroups = ({ options, onToggle }) => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState(null)
  const [conversation, setConversation] = useState(null)
  const [conversationOpen, setConversationOpen] = useState(false)

  useEffect(() => {
    api.get('/recommendations', { params: { page: 0, size: RECOMMENDATION_PAGE_SIZE } })
      .then((response) => Promise.allSettled(response.data.content.map(async (history) => {
        const { data } = await api.get(`/recommendations/${ encodeURIComponent(history.requestId) }`)
        return { ...history, items: recommendedProducts(data) }
      })))
      .then((results) => {
        if (results.some((result) => result.status === 'rejected')) {
          toaster.create({ type: 'error', title: '일부 AI 추천 내역을 불러오지 못했어요.' })
        }
        setGroups(results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter((group) => group.items.length > 0))
      })
      .catch((error) => {
        setGroups([])
        toaster.create({ type: 'error', title: errorMessage(error, 'AI 추천 내역을 불러오지 못했어요.') })
      })
  }, [])

  const askOpenConversation = (group) => {
    setConversation(group)
    setConversationOpen(true)
  }

  const openConversation = () => {
    navigate(`/ai-stylist/${ conversation.requestId }`, { state: { query: conversation.queryText } })
  }

  if (!groups) {
    return <Text color="fg.muted">불러오는 중...</Text>
  }
  if (groups.length === 0) {
    return <Text color="fg.muted">AI 스타일리스트에게 추천받은 상품이 없어요.</Text>
  }

  return (
    <Stack gap="8">
      <Text fontSize="sm" color="fg.muted">AI 스타일리스트가 추천했던 상품이에요</Text>
      { groups.map((group) => (
        <Stack key={ group.requestId } gap="4">
          <Flex align="center" gap="4">
            <LuSparkles/>
            <Text fontWeight="bold" lineClamp="1">{ group.tpoSummary || group.queryText }</Text>
            <Text fontSize="xs" color="fg.muted" flexShrink="0">{ formatRelativeTime(group.createdAt) }</Text>
            <Button
              size="xs"
              variant="plain"
              color="fg.muted"
              marginStart="auto"
              paddingX="0"
              onClick={ () => askOpenConversation(group) }
            >
              대화 보기 <LuChevronRight/>
            </Button>
          </Flex>
          <Text fontSize="sm" color="fg.muted" lineClamp="1">"{ group.queryText }"</Text>
          <OptionGrid items={ group.items } options={ options } onToggle={ onToggle }/>
        </Stack>
      )) }

      <CommunityConfirmDialog
        open={ conversationOpen }
        title="대화를 보러 갈까요?"
        description="이동하면 작성 중인 내용이 사라져요."
        confirmLabel="이동하기"
        onConfirm={ openConversation }
        onClose={ () => setConversationOpen(false) }
      />
    </Stack>
  )
}

const OptionGrid = ({ items, options, onToggle }) => (
  <Grid templateColumns={ { base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' } } gap="4">
    { items.map((item) => {
      const checked = options.some((option) => optionKey(option) === optionKey(item))
      const disabled = !checked && options.length >= MAX_VOTE_OPTIONS

      return (
        <Checkbox.Root
          key={ optionKey(item) }
          checked={ checked }
          disabled={ disabled }
          onCheckedChange={ () => onToggle(item) }
          display="block"
          cursor={ disabled ? 'not-allowed' : 'pointer' }
          opacity={ disabled ? '0.5' : '1' }
        >
          <Checkbox.HiddenInput aria-label={ item.name }/>
          <Box position="relative">
            <ProductImage
              src={ item.imageUrl }
              alt=""
              aspectRatio="square"
              width="full"
              objectFit="cover"
              rounded="md"
              bg="bg.muted"
              borderWidth="md"
              borderColor={ checked ? 'fg' : 'transparent' }
            />
            <Checkbox.Control position="absolute" top="4" right="4" rounded="full" bg={ checked ? undefined : 'bg' }/>
          </Box>
          <Checkbox.Label fontSize="sm" lineClamp="1">{ item.name }</Checkbox.Label>
          <Text fontSize="sm" fontWeight="bold">{ item.price?.toLocaleString() }원</Text>
        </Checkbox.Root>
      )
    }) }
  </Grid>
)