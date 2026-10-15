import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  InputGroup,
  Text,
  Box,
  Button,
  Spinner, Stack, Heading, Center, createListCollection, Flex, Select, Portal,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/axios.js'
import { ProductItem } from '../components/ProductItem.jsx'

const sortCollection = createListCollection({
  items: [
    { label: '정렬', value: '' },
    { label: '글자순', value: 'NAME' },
    { label: '낮은 가격순', value: 'PRICE_ASC' },
    { label: '높은 가격순', value: 'PRICE_DESC' },
  ],
})

export const SearchResultPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryCode = searchParams.get('category')
  const currentSort = searchParams.get('sort') || ''

  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 10

  const fetchProducts = async (targetPage = 0, sortKey = currentSort) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        page: targetPage,
        size: PAGE_SIZE,
      }

      if (sortKey) {
        params.sort = sortKey
      }

      if (categoryCode) {
        params.category = categoryCode
      }

      const response = await api.get('/products', { params })

      const { content = [], hasNext = false } = response.data || {}

      if (targetPage === 0) {
        setDisplayProducts(content)
      } else {
        setDisplayProducts((prev) => [...prev, ...content])
      }

      setPage(targetPage)
      setHasMore(hasNext)
      setIsLoading(false)
      return { content, hasNext }

    } catch (err) {
      setError('상품 목록을 불러오지 못했습니다.')
      setIsLoading(false)
      return { content: [], hasNext: false }
    }
  }

  useEffect(() => {
    let isMounted = true

    const initLoad = async () => {
      setDisplayProducts([])
      const result = await fetchProducts(0, currentSort)
      if (!isMounted) return

      let currentPage = 0
      let currentHasNext = result.hasNext

      while (currentHasNext && document.documentElement.scrollHeight <=
      window.innerHeight) {
        currentPage += 1
        const nextResult = await fetchProducts(currentPage, currentSort)
        if (!isMounted) return
        currentHasNext = nextResult.hasNext
        if (nextResult.content.length === 0) break
      }
    }

    initLoad()

    return () => {
      isMounted = false
    }
  }, [categoryCode, currentSort])

  // 무한 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200) {
        if (!isLoading && hasMore) {
          fetchProducts(page + 1, currentSort)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore, page, categoryCode, currentSort])

  // 💡 정렬 조건 변경 시 URL 쿼리스트링을 업데이트하여 상태와 페이지 이동 시 유지를 보장
  const handleSortChange = ({ value }) => {
    const newSort = value[0] || ''
    const newParams = new URLSearchParams(searchParams)

    if (newSort) {
      newParams.set('sort', newSort)
    } else {
      newParams.delete('sort')
    }

    setSearchParams(newParams)
  }

  return (
    <Stack gap={ 4 } position="relative" minH="100vh" paddingY={ 4 }>
      <AppBar/>

      <Container maxW="3xl">
        <InputGroup
          startElement={ <LuSearch/> }
        >
          <Input
            placeholder="검색어를 입력해주세요"
            defaultValue={ categoryCode ? `카테고리 코드: ${ categoryCode }` : '' }
          />
        </InputGroup>
      </Container>

      {/* 정렬 선택 UI (우측 배치 및 URL 연동을 통한 조건 유지) */ }
      <Container maxWidth="7xl">
        <Flex justify="flex-end">
          <Select.Root
            collection={ sortCollection }
            width="40"
            value={ [currentSort] }
            onValueChange={ handleSortChange }
          >
            <Select.HiddenSelect/>
            <Select.Control>
              <Select.Trigger aria-label="상품 정렬">
                <Select.ValueText placeholder="정렬"/>
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator/>
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  { sortCollection.items.map((item) => (
                    <Select.Item key={ item.value } item={ item }>
                      <Select.ItemText>{ item.label }</Select.ItemText>
                      <Select.ItemIndicator/>
                    </Select.Item>
                  )) }
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </Container>

      <Container maxW="7xl" mx="auto" px={ 5 }>
        <Grid
          templateColumns={ {
            base: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          } }
          gap={ 4 }
        >
          {
            displayProducts?.map((product, index) => {
              const uniqueKey = product.productId ?? index
              return (
                <ProductItem product={ product }></ProductItem>
              )
            })
          }
        </Grid>

        { error && (
          <Center
            align="center"
            justify="center"
            py={ 12 }
          >
            <Text color="fg.muted" textStyle="sm">{ error }</Text>
            <Button
              size="md"
              variant="outline"
              onClick={ () => fetchProducts(page) }
            >
              다시 시도
            </Button>
          </Center>
        ) }

        { isLoading && (
          <Center py={ 12 }>
            <Spinner size="md"/>
          </Center>
        ) }
      </Container>

      <TabBar/>
    </Stack>
  )
}
