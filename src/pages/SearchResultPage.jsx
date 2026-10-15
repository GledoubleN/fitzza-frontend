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
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/axios.js'
import { ProductItem } from '../components/ProductItem.jsx'

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
      <Header/>

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

      <Container maxWidth="7xl">
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
