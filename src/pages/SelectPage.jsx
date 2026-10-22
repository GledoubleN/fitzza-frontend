import {
  Container,
  Grid,
  Stack,
  Text,
  Center,
  Button,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { LuCheck, LuChevronLeft } from 'react-icons/lu'

export const SelectPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  async function loadWishlist (page = 0, size = 100) {
    setIsLoading(true)
    setIsError(false)

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

        const validIds = formattedData.map(p => p.productId ?? p.itemId ?? p.wishlistId)
        setSelectedProductIds(prev => prev.filter(id => validIds.includes(id)))
      } else {
        setIsError(true)
      }
    } catch (error) {
      console.warn('백엔드 통신 실패:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSelect = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleStartWorldCup = () => {
    const selectedProducts = products.filter((p) =>
      selectedProductIds.includes(p.productId ?? p.itemId)
    )
    const candidateProductIds = selectedProducts.map((p) => p.productId ?? p.itemId)

    navigate('/worldcup', {
      state: {
        selectedProducts,
        candidateProductIds,
      },
    })
  }

  useEffect(() => {
    loadWishlist()
  }, [location.pathname])

  return (
    <Stack
      paddingY={ 4 }
      minH="100vh"
      pb={ 32 }
      gap={ 4 }
    >
      <Header />

      <Container
        maxWidth="5xl"
        flex="1"
      >
        <Flex
          align="center"
          gap={ 2 }
          mb={ 4 }
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={ () => navigate('/wishlist') }
          >
            <LuChevronLeft size={ 20 } />
          </Button>
          <Text
            textStyle="lg"
            fontWeight="bold"
          >
            월드컵 후보 선택
          </Text>
        </Flex>

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
          <>
            <Flex
              justify="space-between"
              align="center"
              mb={ 4 }
            >
              <Text
                textStyle="sm"
                color="fg.muted"
              >
                후보로 선택된 상품: { selectedProductIds.length }개
              </Text>
              <Button
                colorPalette="purple"
                size="sm"
                disabled={ selectedProductIds.length < 2 }
                onClick={ handleStartWorldCup }
              >
                { selectedProductIds.length }개로 시작하기
              </Button>
            </Flex>

            <Grid
              templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
              gap={ 4 }
            >
              {
                products.map((product) => {
                  const id = product.productId ?? product.itemId
                  const isSelected = selectedProductIds.includes(id)
                  const name = product.productName ?? product.name
                  const imageUrl = product.thumbnailUrl ?? product.imageUrl

                  return (
                    <Box
                      key={ id }
                      position="relative"
                      borderWidth="1px"
                      borderColor={ isSelected ? 'border.emphasized' : 'border.subtle' }
                      borderRadius="xl"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={ () => handleToggleSelect(id) }
                      transition="all 0.2s"
                    >
                      <Box
                        w="100%"
                        h="48"
                        position="relative"
                        overflow="hidden"
                      >
                        <Image
                          src={ imageUrl }
                          alt={ name }
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />

                        { isSelected && (
                          <Box
                            position="absolute"
                            inset={ 0 }
                            bg="bg.emphasized"
                            opacity={ 0.2 }
                            transition="all 0.2s"
                          />
                        ) }

                        <Flex
                          position="absolute"
                          top={ 2.5 }
                          right={ 2.5 }
                          boxSize={ 6 }
                          borderRadius="full"
                          bg={ isSelected ? 'fg' : 'bg' }
                          color={ isSelected ? 'bg' : 'fg.muted' }
                          align="center"
                          justify="center"
                          boxShadow="sm"
                          borderWidth="thin"
                          borderColor="border.subtle"
                          zIndex={ 20 }
                        >
                          <Box
                            as={ LuCheck }
                            boxSize={ 3.5 }
                          />
                        </Flex>
                      </Box>

                      <Stack
                        p={ 3 }
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
                          textStyle="sm"
                          fontWeight="medium"
                          truncate
                        >
                          { name }
                        </Text>
                        <Text
                          textStyle="sm"
                          fontWeight="bold"
                        >
                          { product.price ? `${ product.price.toLocaleString() }원` : '' }
                        </Text>
                      </Stack>
                    </Box>
                  )
                })
              }
            </Grid>
          </>
        ) }
      </Container>

      <TabBar />
    </Stack>
  )
}
