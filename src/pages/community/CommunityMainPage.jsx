import { useEffect, useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuMessageCircle, LuPencil, LuSearch, LuThumbsUp } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { CATEGORIES, CATEGORY_LABELS, displayNickname, errorMessage, formatRelativeTime } from './communityFormat.js'
import { CommunityTitleBar } from './CommunityTitleBar.jsx'

const PAGE_SIZE = 20

const FILTERS = [
  { label: '전체', params: {} },
  { label: '투표', params: { postType: 'VOTE' } },
  ...CATEGORIES.map(({ value, label }) => ({ label, params: { category: value } })),
]

export const CommunityMainPage = () => {
  const navigate = useNavigate()

  const [filter, setFilter] = useState(FILTERS[0])
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setError('')
    api.get('/community/posts', {
      params: { ...filter.params, keyword: query || undefined, page, size: PAGE_SIZE },
    }).then((response) => {
      if (ignore) return
      setPosts((prev) => page === 0 ? response.data.content : [...prev, ...response.data.content])
      setHasNext(response.data.hasNext ?? page + 1 < response.data.totalPages)
    }).catch((error) => {
      if (ignore) return
      setError(errorMessage(error, '게시글을 불러오지 못했어요.'))
    }).finally(() => {
      if (!ignore) setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [filter, query, page])

  const selectFilter = (next) => {
    setFilter(next)
    setPage(0)
  }

  const search = (event) => {
    event.preventDefault()
    setQuery(keyword.trim())
    setPage(0)
  }

  return (
    <>
      <Stack direction="column" gap="4" minHeight="100vh" paddingY="4">
        <Header/>

        <Container maxWidth="3xl">
          <Stack direction="column" gap="4">
            <CommunityTitleBar/>

            <form onSubmit={ search }>
              <InputGroup startElement={ <LuSearch/> }>
                <Input
                  type="search"
                  placeholder="제목이나 내용으로 검색"
                  aria-label="게시글 검색"
                  rounded="lg"
                  bg="bg.subtle"
                  value={ keyword }
                  onChange={ (e) => setKeyword(e.target.value) }
                />
              </InputGroup>
            </form>

            <HStack gap="4" overflowX="auto">
              { FILTERS.map((item) => (
                <Button
                  key={ item.label }
                  size="sm"
                  rounded="full"
                  flexShrink="0"
                  variant={ filter === item ? 'solid' : 'outline' }
                  onClick={ () => selectFilter(item) }
                >
                  { item.label }
                </Button>
              )) }
            </HStack>
          </Stack>
        </Container>

        <Container maxWidth="3xl" paddingBottom="40">
          <Stack direction="column" gap="0" separator={ <Separator/> }>
            { posts.map((post) => (
              <PostItem
                key={ post.postId }
                post={ post }
                onClick={ () => navigate(`/community/articles/${ post.postId }`) }
              />
            )) }
          </Stack>

          { loading && <Text color="fg.muted" paddingY="4">불러오는 중...</Text> }
          { error && <Text color="fg.error" paddingY="4">{ error }</Text> }
          { !loading && !error && posts.length === 0 && (
            <Text color="fg.muted" paddingY="8" textAlign="center">
              { query ? `'${ query }'에 대한 게시글이 없어요.` : '아직 게시글이 없어요.' }
            </Text>
          ) }
          { !loading && hasNext && (
            <Button width="full" variant="outline" marginTop="4" onClick={ () => setPage(page + 1) }>
              더 보기
            </Button>
          ) }
        </Container>
      </Stack>

      <Box position="fixed" bottom="24" left="0" right="0" pointerEvents="none">
        <Container maxWidth="3xl" display="flex" justifyContent="flex-end">
          <IconButton
            rounded="full"
            size="xl"
            aria-label="글쓰기"
            pointerEvents="auto"
            colorPalette="primary"
            onClick={ () => navigate('/community/write') }
          >
            <LuPencil/>
          </IconButton>
        </Container>
      </Box>
      <TabBar/>
    </>
  )
}

const PostItem = ({ post, onClick }) => {
  const { title, category, postType, nickname, createdAt, thumbnailUrl, likeCount, commentCount } = post

  return (
    <Flex
      as="button"
      gap="4"
      paddingY="4"
      align="flex-start"
      textAlign="start"
      width="full"
      cursor="pointer"
      _hover={ { bg: 'bg.subtle' } }
      onClick={ onClick }
    >
      <Stack direction="column" gap="0" flex="1" minWidth="0">
        <Text fontWeight="medium" lineClamp="2">{ title }</Text>
        <HStack gap="4" paddingY="4">
          { postType === 'VOTE'
            ? <Badge>투표</Badge>
            : <Badge>{ CATEGORY_LABELS[category] ?? category }</Badge> }
        </HStack>
        <HStack gap="4" color="fg.muted" fontSize="sm">
          <Avatar.Root size="2xs">
            <Avatar.Fallback name={ nickname }/>
          </Avatar.Root>
          <Text>{ displayNickname(nickname) } · { formatRelativeTime(createdAt) }</Text>
        </HStack>
        <HStack gap="4">
          <Badge variant="plain" color="fg.muted" size="md" paddingX="0">
            <LuThumbsUp/> { likeCount }
          </Badge>
          <Badge variant="plain" color="fg.muted" size="md" paddingX="0">
            <LuMessageCircle/> { commentCount }
          </Badge>
        </HStack>
      </Stack>

      { thumbnailUrl && (
        <Image
          src={ thumbnailUrl }
          alt=""
          boxSize={ { base: '16', md: '24' } }
          flexShrink="0"
          objectFit="cover"
          rounded="md"
          bg="bg.muted"
        />
      ) }
    </Flex>
  )
}
