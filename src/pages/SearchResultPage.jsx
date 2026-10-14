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
  Spinner, Stack, Heading, Center,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/axios.js'

export const SearchResultPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryCode = searchParams.get('category')

  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 10

  const fetchProducts = async (targetPage = 0) => {
    if (isLoading) return { content: [], hasNext: false }
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        page: targetPage,
        size: PAGE_SIZE,
        sort: 'LATEST',
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
    const initLoad = async () => {
      setDisplayProducts([])
      const result = await fetchProducts(0)

      let currentPage = 0
      let currentHasNext = result.hasNext

      while (currentHasNext && document.documentElement.scrollHeight <=
      window.innerHeight) {
        currentPage += 1
        const nextResult = await fetchProducts(currentPage)
        currentHasNext = nextResult.hasNext
        if (nextResult.content.length === 0) break
      }
    }

    initLoad()
  }, [categoryCode])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200) {
        if (!isLoading && hasMore) {
          fetchProducts(page + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore, page, categoryCode])

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

      <Container maxW="7xl">
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
                <GridItem
                  key={ uniqueKey }
                  overflow="hidden"
                  cursor="pointer"
                  position="relative"
                  onClick={ () => navigate(
                    `/products/${ product.productId }`) }
                >
                  <Grid
                    templateRows="auto auto"
                    templateAreas={ `"image" "content"` }
                    gap={ 4 }
                  >
                    <GridItem gridArea="image" position="relative">
                      <IconButton
                        position="absolute"
                        top={ 2 }
                        right={ 2 }
                        aria-label="찜하기"
                        rounded="full"
                        variant="ghost"
                        size="md"
                        zIndex={ 2 }
                        onClick={ (event) => event.stopPropagation() }
                      >
                        <LuHeart/>
                      </IconButton>
                      <Image
                        src={ product.thumbnailUrl }
                        width="100%"
                        objectFit="contain"
                      />
                    </GridItem>

                    <Stack
                      gridArea="content"
                      display="flex"
                      flexDirection="column"
                    >
                      <Text
                        textStyle="xs"
                        color="fg.muted"
                        truncate
                      >
                        { product.brandName }
                      </Text>
                      <Heading
                        size={ 'md' }
                        truncate
                      >
                        { product.productName }
                      </Heading>
                      <Text
                        textStyle="xs"
                        fontWeight="bold"
                      >
                        { product.price?.toLocaleString() } 원
                      </Text>
                    </Stack>
                  </Grid>
                </GridItem>
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
