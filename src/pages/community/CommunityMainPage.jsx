import { useEffect, useState } from 'react'
import {
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
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  LuChevronLeft,
  LuMessageCircle,
  LuPencil,
  LuSearch,
  LuThumbsUp,
} from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { AppBar } from '../../components/AppBar.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { HttpStatusCode } from 'axios'

const CATEGORIES = ['전체', '투표', '코디 질문', '자유']

export const CommunityMainPage = () => {

  const moveUrl = useNavigate()

  const [selected, setSelected] = useState('전체')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/community/articles', {})
    .then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setArticles(response.data)
    }).catch(error => console.log(error))
  }, [])

  const fetchArticles = async (category) => {
    setLoading(true)
    setError('')

    api.get(
      '/community/articles',
      {
        params: category === '전체' ? {} : { category },
      },
    ).then(response => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setArticles(response.data)
      setLoading(false)
    }).catch(error => console.log(error))
  }

  // 최초 진입 + 카테고리 변경 시 재조회
  useEffect(() => {
    fetchArticles(selected)
  }, [selected])

  const categoryHandler = (category) => {
    setSelected(category)
  }

  const articleHandler = (id) => {
    console.log('>>> debug articleHandler Clicked : ' + id)
    moveUrl(`/community/articles/${ id }`)
  }

  const writeHandler = () => {
    console.log('>>> debug writeHandler Clicked')
    moveUrl(`/community/write`)
  }

  return (
    <>
      <Container maxWidth="xl" minHeight="100vh" paddingY="4"
                 position="relative">
        <Stack direction="column" gap="4">
          {/* 상단 로고 바 */ }
          <AppBar></AppBar>

          {/* 커뮤니티 헤더 */ }
          <Flex align="center" justify="space-between">
            <HStack gap="2">
              <IconButton rounded="full" variant="ghost" size="sm"
                          aria-label="뒤로">
                <LuChevronLeft/>
              </IconButton>
              <Text fontSize="lg" fontWeight="semibold">
                커뮤니티
              </Text>
            </HStack>
            <IconButton rounded="full" variant="ghost" aria-label="검색">
              <LuSearch/>
            </IconButton>
          </Flex>

          {/* 검색 입력 (선택) */ }
          <InputGroup startElement={ <LuSearch/> }>
            <Input placeholder="검색" rounded="lg" bg="gray.50"/>
            {/*  제목 및 내용으로 검색 기능 추가 필요 TO-DO-NEXT */ }
          </InputGroup>

          {/* 카테고리 탭 */ }
          <HStack gap="2" overflowX="auto">
            { CATEGORIES.map((cat) => (
              <Button
                key={ cat }
                size="sm"
                rounded="full"
                flexShrink="0"
                variant={ selected === cat ? 'solid' : 'outline' }
                colorPalette="gray"
                onClick={ () => categoryHandler(cat) }
              >
                { cat }
              </Button>
            )) }
          </HStack>

          {/* 게시글 리스트 */ }
          <Stack direction="column" gap="0" paddingBottom="20"
                 separator={ <Box borderBottomWidth="1px"/> }>
            { loading && <Text color="gray.500" paddingY="4">불러오는 중...</Text> }
            { error && <Text color="red.500" paddingY="4">{ error }</Text> }
            { articles.map((article) => (
              <ArticleItem
                key={ article.id }
                article={ article }
                onClick={ () => articleHandler(article.id) }
              />
            )) }
          </Stack>
        </Stack>

        {/* 글쓰기 플로팅 버튼 */ }
        <Box position="fixed"
             bottom="calc(env(safe-area-inset-bottom, 0px) + 96px)" left="0"
             right="0" pointerEvents="none">
          <Container maxWidth="xl" display="flex" justifyContent="flex-end">
            <IconButton
              rounded="full"
              colorPalette="orange"
              size="xl"
              aria-label="글쓰기"
              pointerEvents="auto"
              onClick={ writeHandler }
            >
              <LuPencil/>
            </IconButton>
          </Container>
        </Box>
      </Container>
      <TabBar/>
    </>
  )
}

const ArticleItem = ({ article, onClick }) => {
  const { category, title, author, time, likes, comments, vote } = article
  const images = article.images ?? [] // 글 내부에 image가 없는 경우 대비해서 빼놨습니다. null값 안 온다고 확정다면 images=[] 넣으면 됨.

  return (
    <Flex gap="3" paddingY="4" align="flex-start" cursor="pointer"
          onClick={ onClick }>
      {/* 글 제목 */ }
      <Stack direction="column" gap="2" flex="1" minWidth="0">
        <Text fontWeight="semibold" lineClamp="2">
          { title }
        </Text>
        <Badge width="fit-content" colorPalette="gray">
          { category }
        </Badge>
        <HStack gap="2" color="gray.500" fontSize="sm">
          <Box boxSize="6" rounded="full" bg="gray.200" flexShrink="0"/>
          <Text>{ author }</Text>
          <Text>·</Text>
          <Text>{ time }</Text>
        </HStack>
        <HStack gap="4" color="gray.500" fontSize="sm">
          <HStack gap="1">
            <LuThumbsUp/>
            <Text>{ likes }</Text>
          </HStack>
          <HStack gap="1">
            <LuMessageCircle/>
            <Text>{ comments }</Text>
          </HStack>
        </HStack>
      </Stack>

      {/* 썸네일 사진 */ }
      <HStack gap="1" flexShrink="0" align="center">
        { images.slice(0, 2).map((src, i) => (
          <Image
            key={ i }
            src={ src }
            boxSize="14"
            objectFit="cover"
            rounded="md"
            bg="gray.100"
          />
        )) }
        { vote && images.length >= 2 && (
          <Text
            position="absolute"
            fontSize="xs"
            fontWeight="bold"
            color="fg.muted"
          >
            {/*  썸네일 사진 관련 컴포넌트 */ }
          </Text>
        ) }
      </HStack>
    </Flex>
  )
}
