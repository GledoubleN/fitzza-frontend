import { useState, useEffect } from 'react'
import { Card, Container, Grid, GridItem, IconButton, Image, Input, InputGroup, Text, Box, Button, Spinner } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import exampleProductImage from '../assets/hero.png'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'

export const SearchResultPage = () => {
  const navigate = useNavigate()
  const [displayProducts, setDisplayProducts] = useState([])
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 10

  const fetchProducts = async (targetPage = 0) => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get('/products', {
        params: {
          page: targetPage,
          size: PAGE_SIZE,
          sort: 'LATEST'
        }
      })

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
      const result = await fetchProducts(0)

      let currentPage = 0
      let currentHasNext = result.hasNext

      while (currentHasNext && document.documentElement.scrollHeight <= window.innerHeight) {
        currentPage += 1
        const nextResult = await fetchProducts(currentPage)
        currentHasNext = nextResult.hasNext
        if (nextResult.content.length === 0) break
      }
    }

    initLoad()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        if (!isLoading && hasMore) {
          fetchProducts(page + 1)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore, page])

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5} mb={6}>
        <InputGroup startElement={<Box as={LuSearch} boxSize={5} color="fg.muted" />}>
          <Input
            placeholder="검색어를 입력해주세요"
            borderRadius="xl"
            borderWidth="thin"
            borderColor="border.subtle"
            py={5}
          />
        </InputGroup>
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
            <Button size="xs" variant="outline" onClick={() => fetchProducts(page)}>다시 시도</Button>
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