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

export const WishlistPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fallbackWishlists = [
    {
      productId: 5,
      productName: "Denim Trucker Jacket",
      brandName: "Saint Laurent",
      price: 2300000,
      thumbnailUrl: "/product-image.png",
      status: "ON_SALE"
    },
    {
      productId: 8,
      productName: "Technical Windbreaker",
      brandName: "Moncler",
      price: 1950000,
      thumbnailUrl: "/product-image.png",
      status: "ON_SALE"
    },
    {
      productId: 12,
      productName: "Silk Poplin Shirt",
      brandName: "Valentino",
      price: 980000,
      thumbnailUrl: "/product-image.png",
      status: "ON_SALE"
    },
    {
      productId: 13,
      productName: "Re-Nylon Puffer Jacket",
      brandName: "Prada",
      price: 3400000,
      thumbnailUrl: "/product-image.png",
      status: "ON_SALE"
    }
  ]

  async function loadWishlist (page = 0, size = 10) {
    setIsLoading(true)
    setIsError(false)
    try {
      const response = await api.get('/wishlists', {
        params: { page, size }
      })
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.content || response.data
        setProducts(Array.isArray(data) && data.length > 0 ? data : fallbackWishlists)
      } else {
        setProducts(fallbackWishlists)
      }
    } catch (error) {
      console.warn('백엔드 통신 실패, 목업 데이터를 사용합니다:', error)
      setProducts(fallbackWishlists)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistChange = (targetProductId) => {
    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => (product.productId || product.itemId) !== targetProductId
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

        {!isLoading && isError && (
          <Center height="100%" flexDirection="column" gap={4}>
            <Text color="red.500">찜 목록을 불러오지 못했습니다.</Text>
            <Button onClick={() => loadWishlist()} size="sm">다시 시도</Button>
          </Center>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <Center height="100%">
            <Text color="gray.500">찜한 상품이 없습니다.</Text>
          </Center>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <Grid
            templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - 1rem * 4) / 5)), 1fr))' }
            gap={ 4 }
          >
            {
              products.map((product) => (
                <ProductItem
                  key={ product.productId || product.itemId || product.wishlistId }
                  product={ product }
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