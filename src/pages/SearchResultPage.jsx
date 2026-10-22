import { useState, useEffect, useRef } from 'react'
import {
  Container,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Image,
  Text,
  Box,
  Button,
  Spinner, Stack, Heading, Center, createListCollection, Flex, Select, Portal, Menu,
} from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuChevronDown, LuChevronRight, LuHeart } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/axios.js'
import { ProductItem } from '../components/ProductItem.jsx'
import { Toaster } from '../components/ui/toaster.jsx'

const sortCollection = createListCollection({
  items: [
    { label: '최신순', value: 'TIME_DESC' },
    { label: '낮은 가격순', value: 'PRICE_ASC' },
  ],
})

const findCategoryPath = (categories, code) => {
  for (const category of categories) {
    if (category.code === code) {
      return [category]
    }
    const childPath = findCategoryPath(category.children ?? [], code)
    if (childPath.length > 0) {
      return [category, ...childPath]
    }
  }
  return []
}

const CategoryMenu = ({ label, categories, onSelect }) => (
  <Menu.Root onSelect={ ({ value }) => onSelect(value) }>
    <Menu.Trigger asChild>
      <Button variant="plain" paddingX={ 0 } minWidth={ 0 }>
        <Heading size="lg" truncate>{ label }</Heading>
        <Icon size="xs" ><LuChevronDown/></Icon>
      </Button>
    </Menu.Trigger>
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          { categories.map((category) => (
            <Menu.Item key={ category.code } value={ category.code }>
              { category.name }
            </Menu.Item>
          )) }
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
)

export const SearchResultPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryCode = searchParams.get('category')
  const currentSort = searchParams.get('sort') || 'TIME_DESC'

  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [categories, setCategories] = useState([])

  const [topCategory, secondCategory] = categoryCode
    ? findCategoryPath(categories, categoryCode)
    : []

  const PAGE_SIZE = 10
  const latestRequestId = useRef(0)

  const fetchProducts = async (targetPage = 0, sortKey = currentSort) => {
    const requestId = ++latestRequestId.current
    const isStale = () => requestId !== latestRequestId.current

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

      if (isStale()) {
        return { content: [], hasNext: false }
      }

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
      if (isStale()) {
        return { content: [], hasNext: false }
      }

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

  useEffect(() => {
    api.get('/categories')
      .then((response) => setCategories(response.data ?? []))
      .catch(() => setCategories([]))
  }, [])

  const selectCategory = (code) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('category', code)
    setSearchParams(newParams)
  }

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
      <Header/>
      <Container maxW="5xl">
        <Grid
          templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
          gap={ 4 }
          alignItems="center"
        >
          { topCategory && (
            <Flex gridColumn="1 / -2" alignItems="center" gap={ 4 } minWidth={ 0 }>
              <CategoryMenu
                label={ topCategory.name }
                categories={ categories }
                onSelect={ selectCategory }
              />
              { topCategory.children?.length > 0 && (
                <>
                  <Icon size="sm" color="fg.muted"><LuChevronRight/></Icon>
                  <CategoryMenu
                    label={ secondCategory?.name ?? '전체' }
                    categories={ [{ code: topCategory.code, name: '전체' }, ...topCategory.children] }
                    onSelect={ selectCategory }
                  />
                </>
              ) }
            </Flex>
          ) }
          <Select.Root
            collection={ sortCollection }
            gridColumn={ -2 }
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
        </Grid>
      </Container>

      {/* 정렬 선택 UI (우측 배치 및 URL 연동을 통한 조건 유지) */ }
      <Container maxWidth="5xl">
        <Grid
          templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
          gap={ 4 }
        >
          {
            displayProducts?.map((product, index) => {
              const uniqueKey = product.productId ?? index
              return (
                <ProductItem
                  key={ uniqueKey }
                  product={ product }
                ></ProductItem>
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

      <Toaster />
    </Stack>
  )
}
