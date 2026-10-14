import { useState, useEffect } from 'react'
import { Card, Container, Grid, GridItem, IconButton, Image, Input, InputGroup, Text, Box, Button, Spinner, Flex, NativeSelect } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import exampleProductImage from '../assets/hero.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/axios.js'

export const SearchResultPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryCode = searchParams.get('category')
  // 💡 URL 쿼리스트링에서 정렬 조건을 읽어와서 페이지 이동/새로고침 시에도 조건 유지
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

  // categoryCode나 URL의 sort가 바뀔 때 초기 데이터 로드 및 스크롤바 확보
  useEffect(() => {
    let isMounted = true

    const initLoad = async () => {
      setDisplayProducts([])
      const result = await fetchProducts(0, currentSort)
      if (!isMounted) return

      let currentPage = 0
      let currentHasNext = result.hasNext

      while (currentHasNext && document.documentElement.scrollHeight <= window.innerHeight) {
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
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        if (!isLoading && hasMore) {
          fetchProducts(page + 1, currentSort)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore, page, categoryCode, currentSort])

  // 💡 정렬 조건 변경 시 URL 쿼리스트링을 업데이트하여 상태와 페이지 이동 시 유지를 보장
  const handleSortChange = (e) => {
    const newSort = e.target.value
    const newParams = new URLSearchParams(searchParams)

    if (newSort) {
      newParams.set('sort', newSort)
    } else {
      newParams.delete('sort')
    }

    setSearchParams(newParams)
  }

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5} mb={4}>
        <InputGroup startElement={<Box as={LuSearch} boxSize={5} color="fg.muted" />}>
          <Input
            placeholder="검색어를 입력해주세요"
            borderRadius="xl"
            borderWidth="thin"
            borderColor="border.subtle"
            py={5}
            defaultValue={categoryCode ? `카테고리 코드: ${categoryCode}` : ''}
          />
        </InputGroup>
      </Container>

      {/* 정렬 선택 UI (우측 배치 및 URL 연동을 통한 조건 유지) */}
      <Container maxW="7xl" mx="auto" px={5} mb={4}>
        <Flex justify="flex-end">
          <NativeSelect.Root size="sm" width="130px">
            <NativeSelect.Field
              value={currentSort}
              onChange={handleSortChange}
            >
              <option value="">정렬</option>
              <option value="NAME">글자순</option>
              <option value="PRICE_ASC">낮은 가격순</option>
              <option value="PRICE_DESC">높은 가격순</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Container>

      <Container maxW="7xl" mx="auto" px={5}>
        <Grid
          templateColumns={{
            base: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          {
            displayProducts?.map((product, index) => {
              const uniqueKey = product.productId ?? product.id ?? index
              return (
                <GridItem key={uniqueKey}>
                  <Card.Root
                    variant="subtle"
                    borderWidth="thin"
                    borderColor="border.subtle"
                    bg="bg.panel"
                    borderRadius="2xl"
                    overflow="hidden"
                    cursor="pointer"
                    position="relative"
                    _hover={{ borderColor: 'fg.muted' }}
                    onClick={() => navigate(`/products/${product.productId ?? product.id}`)}
                  >
                    <Grid
                      templateRows="auto auto"
                      templateAreas={`
                        "image"
                        "content"
                      `}
                    >
                      <GridItem gridArea="image" position="relative">
                        <IconButton
                          position="absolute"
                          top={2}
                          right={2}
                          aria-label="찜하기"
                          rounded="full"
                          variant="ghost"
                          size="xs"
                          zIndex={2}
                        >
                          <Box as={LuHeart} boxSize={3.5} />
                        </IconButton>
                        <Image src={product.thumbnailUrl || exampleProductImage} w="100%" h="28" objectFit="cover" />
                      </GridItem>

                      <GridItem gridArea="content">
                        <Card.Body p={2.5} gap={1}>
                          <Text textStyle="xs" color="fg.muted" truncate>{product.brandName || product.brand}</Text>
                          <Text textStyle="xs" fontWeight="semibold" truncate>{product.productName || product.name}</Text>
                          <Text textStyle="2xs" fontWeight="bold">{product.price?.toLocaleString()} 원</Text>
                        </Card.Body>
                      </GridItem>
                    </Grid>
                  </Card.Root>
                </GridItem>
              )
            })
          }
        </Grid>

        {error && (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} gap={3}>
            <Text color="fg.muted" textStyle="sm">{error}</Text>
            <Button size="xs" variant="outline" onClick={() => fetchProducts(page, currentSort)}>다시 시도</Button>
          </Box>
        )}

        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Spinner size="sm" />
          </Box>
        )}
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  )
}