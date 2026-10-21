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
        params: { page, size, _t: Date.now() }
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
    <Stack paddingY={ 4 } minH="100vh" pb={ 32 } gap={ 4 }>
      <Header />
      <Container maxWidth="5xl" flex="1">
        <Flex align="center" gap={ 2 } mb={ 4 }>
          <Button variant="ghost" size="sm" onClick={() => navigate('/wishlist')}>
            <LuChevronLeft size={ 20 } />
          </Button>
          <Text textStyle="lg" fontWeight="bold">월드컵 후보 선택</Text>
        </Flex>

        {isLoading && (
          <Center height="100%">
            <Text>찜 목록을 불러오는 중입니다...</Text>
          </Center>
        )}

        {!isLoading && isError && (
          <Center height="100%" flexDirection="column" gap={ 4 }>
            <Text color="fg.error">찜 목록을 불러오지 못했습니다.</Text>
            <Button onClick={() => loadWishlist()} size="sm">다시 시도</Button>
          </Center>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <Center height="100%">
            <Text color="fg.muted">찜한 상품이 없습니다.</Text>
          </Center>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            {/* 💡 상단 안내 문구와 월드컵 시작 버튼을 같은 라인에 배치 */}
            <Flex justify="space-between" align="center" mb={ 3 } wrap="wrap" gap={ 2 }>
              <Text textStyle="sm" color="fg.muted">
                이상형 월드컵에 참여할 상품을 선택해 주세요 (2개 이상)
              </Text>

              <Button
                size="sm"
                bg="black"
                color="white"
                borderRadius="full"
                px={ 4 }
                disabled={ selectedProductIds.length < 2 }
                onClick={ handleStartWorldCup }
                _hover={{ bg: 'gray.800' }}
              >
                월드컵 시작 ({ selectedProductIds.length })
              </Button>
            </Flex>

            <Grid
              templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - var(--chakra-spacing-4) * 4) / 5)), 1fr))' }
              gap={ 4 }
            >
              {
                products.map((product) => {
                  const id = product.productId ?? product.itemId ?? product.wishlistId
                  const isSelected = selectedProductIds.includes(id)
                  const imageUrl = product.thumbnailUrl || product.imageUrl
                  const name = product.productName || product.name

                  return (
                    <Box
                      key={ id }
                      borderWidth="2px"
                      borderColor={ isSelected ? 'black' : 'border.subtle' }
                      borderRadius="xl"
                      overflow="hidden"
                      bg={ isSelected ? 'bg.subtle' : 'bg.panel' }
                      position="relative"
                      cursor="pointer"
                      onClick={() => handleToggleSelect(id)}
                      transition="all 0.2s"
                      boxShadow={ isSelected ? 'md' : 'none' }
                      transform={ isSelected ? 'translateY(-2px)' : 'translateY(0)' }
                      _hover={{ borderColor: isSelected ? 'black' : 'fg.muted' }}
                      userSelect="none"
                    >
                      {/* 이미지 영역 */}
                      <Box w="100%" h="48" position="relative" overflow="hidden">
                        <Image
                          src={ imageUrl }
                          alt={ name }
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />

                        {/* 선택 시 이미지에 어두운 오버레이 */}
                        {isSelected && (
                          <Box
                            position="absolute"
                            inset={ 0 }
                            bg="blackAlpha.200"
                            transition="all 0.2s"
                          />
                        )}

                        {/* 우측 상단 체크 동그라미 표시 */}
                        <Flex
                          position="absolute"
                          top={ 2.5 }
                          right={ 2.5 }
                          boxSize={ 6 }
                          borderRadius="full"
                          bg={ isSelected ? 'black' : 'whiteAlpha.900' }
                          color={ isSelected ? 'white' : 'gray.400' }
                          align="center"
                          justify="center"
                          boxShadow="sm"
                          borderWidth="thin"
                          borderColor="border.subtle"
                          zIndex={ 20 }
                        >
                          <Box as={ LuCheck } boxSize={ 3.5 } />
                        </Flex>
                      </Box>

                      {/* 상품 정보 영역 */}
                      <Stack p={ 3 } gap={ 1 }>
                        <Text textStyle="xs" color="fg.muted" truncate>{ product.brandName }</Text>
                        <Text textStyle="sm" fontWeight="medium" truncate>{ name }</Text>
                        <Text textStyle="sm" fontWeight="bold">{ product.price ? `${product.price.toLocaleString()}원` : '' }</Text>
                      </Stack>
                    </Box>
                  )
                })
              }
            </Grid>
          </>
        )}
      </Container>

      <TabBar />
    </Stack>
  )
}