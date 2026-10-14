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
  Spinner, Stack,
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
    <Stack gap={ 4 } position="relative" minH="100vh" paddingY={ 4 } bg="bg">
      <AppBar/>

      <Container maxW="3xl" mx="auto" px={ 5 } mb={ 6 }>
        <InputGroup startElement={ <Box as={ LuSearch } boxSize={ 5 }
                                        color="fg.muted"/> }>
          <Input
            placeholder="검색어를 입력해주세요"
            borderRadius="xl"
            borderWidth="thin"
            borderColor="border.subtle"
            py={ 5 }
            defaultValue={ categoryCode ? `카테고리 코드: ${ categoryCode }` : '' }
          />
        </InputGroup>
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
                <GridItem key={ uniqueKey }>
                  <Box
                    overflow="hidden"
                    cursor="pointer"
                    position="relative"
                    onClick={ () => navigate(
                      `/products/${ product.productId }`) }
                  >
                    <Grid
                      templateRows="auto auto"
                      templateAreas={ `"image" "content"` }
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

                      <GridItem gridArea="content">
                        <Box
                          p={ 2.5 }
                          display="flex"
                          flexDirection="column"
                          gap={ 1 }
                        >
                          <Text
                            textStyle="xs"
                            color="fg.muted"
                            truncate
                          >
                            { product.brandName }
                          </Text>
                          <Text
                            textStyle="xs"
                            fontWeight="semibold"
                            truncate
                          >
                            { product.productName }
                          </Text>
                          <Text
                            textStyle="2xs"
                            fontWeight="bold"
                          >
                            { product.price?.toLocaleString() } 원
                          </Text>
                        </Box>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>
              )
            })
          }
        </Grid>

        { error && (
          <Box display="flex" flexDirection="column" alignItems="center"
               justifyContent="center" py={ 10 } gap={ 3 }>
            <Text color="fg.muted" textStyle="sm">{ error }</Text>
            <Button size="xs" variant="outline"
                    onClick={ () => fetchProducts(page) }>다시 시도</Button>
          </Box>
        ) }

        { isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center"
               py={ 8 }>
            <Spinner size="sm"/>
          </Box>
        ) }
      </Container>

      <Box position="fixed" bottom={ 0 } left={ 0 } right={ 0 } zIndex={ 10 }
           bg="bg">
        <TabBar/>
      </Box>
    </Stack>
  )
}
