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
import { Toaster, toaster } from '../components/ui/toaster.jsx'

export const WishlistPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

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

      <TabBar />

      <Toaster />
    </Stack>
  )
}
