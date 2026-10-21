import {
  Container,
  Grid,
  Stack,
  Text,
  Center,
  Button,
} from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { ProductItem } from '../components/ProductItem.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toaster } from '../components/ui/toaster.jsx'

export const WishlistPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  async function loadWishlist (page = 0, size = 100) {
    setIsLoading(true)
    setIsError(false)
    setIsUnauthorized(false)
    try {
      const response = await api.get('/wishlists', {
        params: { page, size }
      })
      if (response.status === HttpStatusCode.Ok) {
        const rawData = response.data.content || response.data

        const formattedData = Array.isArray(rawData)
          ? rawData.map(item => ({
            ...item,
            productId: item.productId ?? item.itemId,
            productName: item.productName ?? item.name,
            thumbnailUrl: item.thumbnailUrl ?? item.imageUrl,
            brandName: item.brandName ?? ''
          }))
          : []

        setProducts(formattedData)
      } else {
        setIsError(true)
      }
    } catch (error) {
      console.warn('백엔드 통신 실패:', error)
      if (error.response?.status === HttpStatusCode.Unauthorized) {
        setIsUnauthorized(true)
      } else {
        setIsError(true)
        toaster.create({
          title: '찜 목록을 불러오지 못했습니다.',
          type: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistChange = (targetProductId) => {
    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => (product.productId ?? product.itemId) !== targetProductId
      )
    )
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  return (
    <Stack paddingY={ 4 } height={ '100vh' } gap={ 4 }>
      <Header />
      <Container maxWidth="5xl" flex="1">
        {isLoading && (
          <Center height="100%">
            <Text>찜 목록을 불러오는 중입니다...</Text>
          </Center>
        )}

        {!isLoading && isUnauthorized && (
          <Center height="100%" flexDirection="column" gap={ 4 }>
            <Text color="fg.muted">로그인 후 이용 가능한 서비스입니다.</Text>
            <Button onClick={() => navigate('/signin')} size="sm">
              로그인하러 가기
            </Button>
          </Center>
        )}

        {!isLoading && !isUnauthorized && isError && (
          <Center height="100%" flexDirection="column" gap={ 4 }>
            <Text color="fg.error">찜 목록을 불러오지 못했습니다.</Text>
            <Button onClick={() => loadWishlist()} size="sm">다시 시도</Button>
          </Center>
        )}

        {!isLoading && !isUnauthorized && !isError && products.length === 0 && (
          <Center height="100%">
            <Text color="fg.muted">찜한 상품이 없습니다.</Text>
          </Center>
        )}

        {!isLoading && !isUnauthorized && !isError && products.length > 0 && (
          <Grid
            templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
            gap={ 4 }
          >
            {
              products.map((product) => (
                <ProductItem
                  key={ product.productId ?? product.itemId ?? product.wishlistId }
                  product={ product }
                  isLiked={ true }
                  onWishlistChange={ handleWishlistChange }
                />
              ))
            }
          </Grid>
        )}
      </Container>
      <TabBar />
    </Stack>
  )
}