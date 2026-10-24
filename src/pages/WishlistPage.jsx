import {
  Container,
  Grid,
  Stack,
  Text,
  Center,
  Button,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { ProductItem } from '../components/ProductItem.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'
import { LuTrophy } from 'react-icons/lu'
import { Toaster, toaster } from '../components/ui/toaster.jsx'

export const WishlistPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()

  async function loadWishlist (page = 0, size = 100) {
    setIsLoading(true)
    setIsError(false)

    try {
      const response = await api.get('/wishlists', {
        params: { page, size }
      })

      if (response.status === HttpStatusCode.Ok) {
        const formattedData = response.data.content.map(item => ({
          productId: item.itemId,
          productName: item.name,
          thumbnailUrl: item.imageUrl,
          brandName: item.brandName,
          price: item.price,
        }))

        setProducts(formattedData)
      } else {
        setIsError(true)
      }
    } catch (error) {
      console.warn('백엔드 통신 실패:', error)
      setIsError(true)
      toaster.create({
        title: '찜 목록을 불러오지 못했습니다.',
        type: 'error',
        closable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistChange = (targetProductId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== targetProductId)
    )
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  return (
    <Stack
      paddingY={ 4 }
      height={ '100vh' }
      gap={ 4 }
    >
      <Header />

      <Container
        maxWidth="5xl"
        flex="1"
      >
        { isLoading && (
          <Center height="100%">
            <Text>찜 목록을 불러오는 중입니다...</Text>
          </Center>
        ) }

        { !isLoading && isError && (
          <Center
            height="100%"
            flexDirection="column"
            gap={ 4 }
          >
            <Text color="fg.error">찜 목록을 불러오지 못했습니다.</Text>
            <Button
              onClick={ () => loadWishlist() }
              size="sm"
            >
              다시 시도
            </Button>
          </Center>
        ) }

        { !isLoading && !isError && products.length === 0 && (
          <Center height="100%">
            <Text color="fg.muted">찜한 상품이 없습니다.</Text>
          </Center>
        ) }

        { !isLoading && !isError && products.length > 0 && (
          <Grid
            templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
            gap={ 4 }
          >
            {
              products.map((product) => (
                <ProductItem
                  key={ product.productId }
                  product={ product }
                  isLiked={ true }
                  onWishlistChange={ handleWishlistChange }
                />
              ))
            }
          </Grid>
        ) }
      </Container>

      { products.length >= 2 && (
        <Box
          position="fixed"
          bottom={ 24 }
          right={ { base: 6, lg: 'calc((100vw - 64rem) / 2 + 2.5rem)' } }
          zIndex={ 30 }
        >
          <IconButton
            size="lg"
            rounded="full"
            bg="bg.panel"
            color="fg"
            borderWidth="1px"
            borderColor="border.subtle"
            boxShadow="lg"
            _hover={ { bg: 'bg.subtle', transform: 'scale(1.05)' } }
            transition="all 0.2s"
            aria-label="이상형 월드컵 시작"
            onClick={ () => navigate('/select') }
          >
            <LuTrophy />
          </IconButton>
        </Box>
      ) }

      <TabBar />

      <Toaster />
    </Stack>
  )
}