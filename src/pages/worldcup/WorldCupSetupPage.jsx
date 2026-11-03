import {
  Container,
  Grid,
  Stack,
  Text,
  Center,
  Button,
  Box,
  Flex,
} from '@chakra-ui/react'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { useEffect, useState } from 'react'
import { api } from '../../api/axios.js'
import { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'
import { LuCheck, LuChevronLeft } from 'react-icons/lu'
import { toaster } from '../../components/ui/toaster.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

const MAX_CANDIDATES = 64

export const WorldCupSetupPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState([])
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

        const validIds = formattedData.map(p => p.productId)
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

  const isOverLimit = selectedProductIds.length > MAX_CANDIDATES

  const handleToggleSelect = (productId) => {
    const isSelecting = !selectedProductIds.includes(productId)

    if (isSelecting && selectedProductIds.length === MAX_CANDIDATES) {
      toaster.create({
        title: `한 번에 진행할 수 있는 최대 상품은 ${ MAX_CANDIDATES }개 입니다.`,
        type: 'warning',
      })
    }

    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleStartWorldCup = () => {
    const selectedProducts = products.filter((p) =>
      selectedProductIds.includes(p.productId)
    )
    const candidateProductIds = selectedProducts.map((p) => p.productId)

    navigate('/worldcup', {
      state: {
        selectedProducts,
        candidateProductIds,
      },
    })
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  return (
    <Stack
      paddingY={ 4 }
      minH="100vh"
      gap={ 4 }
    >
      <Header />

      <Container
        maxWidth="5xl"
        flex="1"
      >
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={ 4 }
          mb={ 4 }
        >
          <Flex
            align="center"
            gap={ 4 }
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label="찜 목록으로 돌아가기"
              onClick={ () => navigate('/wishlist') }
            >
              <LuChevronLeft />
            </Button>
            <Text
              as="button"
              textStyle="lg"
              fontWeight="bold"
              cursor="pointer"
              onClick={ () => navigate('/wishlist') }
            >
              월드컵 후보 선택
            </Text>
          </Flex>
          <Flex
            gap={ 2 }
            marginStart="auto"
          >
            <Button
              size="sm"
              minWidth="16"
              variant="outline"
              onClick={ () => navigate('/worldcup/history', { state: { fromWorldCup: true } }) }
            >
              이력 보기
            </Button>
            { !isLoading && !isError && products.length > 0 && (
              <Button
                size="sm"
                minWidth="32"
                bg={ isOverLimit ? 'terracotta.subtle' : 'terracotta.solid/70' }
                color={ isOverLimit ? 'fg.error' : 'terracotta.contrast' }
                borderColor={ isOverLimit ? 'fg.error' : 'terracotta.solid' }
                disabled={ selectedProductIds.length < 2 || isOverLimit }
                _disabled={ isOverLimit ? { opacity: 1 } : undefined }
                onClick={ handleStartWorldCup }
              >
                { selectedProductIds.length }/{ MAX_CANDIDATES } 개로 시작하기
              </Button>
            ) }
          </Flex>
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
            <Grid
              templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
              gap={ 4 }
            >
              {
                products.map((product) => {
                  const id = product.productId
                  const isSelected = selectedProductIds.includes(id)
                  const name = product.productName
                  const imageUrl = product.thumbnailUrl

                  return (
                    <Box
                      key={ id }
                      as="button"
                      type="button"
                      className="group"
                      aria-label={ `${ product.brandName } ${ name }` }
                      aria-pressed={ isSelected }
                      position="relative"
                      display="flex"
                      flexDirection="column"
                      gap={ 3 }
                      padding={ 2 }
                      paddingBottom={ 3 }
                      textAlign="left"
                      cursor="pointer"
                      layerStyle="glass"
                      borderWidth="thin"
                      borderColor={ isSelected ? 'terracotta.solid' : 'border.subtle' }
                      boxShadow="sm"
                      transition="box-shadow 0.25s ease, border-color 0.25s ease"
                      _hover={ { boxShadow: 'lg' } }
                      onClick={ () => handleToggleSelect(id) }
                    >
                      <Box
                        as="span"
                        display="block"
                        position="relative"
                        aspectRatio={ 3 / 4 }
                        overflow="hidden"
                        bg="bg.muted"
                      >
                        <ProductImage
                          src={ imageUrl }
                          alt={ name }
                          width="full"
                          height="full"
                          objectFit="cover"
                          transition="transform 0.4s ease"
                          _groupHover={ { transform: 'scale(1.05)' } }
                        />

                        <Flex
                          as="span"
                          position="absolute"
                          top={ 2 }
                          right={ 2 }
                          zIndex={ 1 }
                          boxSize={ 6 }
                          borderRadius="full"
                          bg={ isSelected ? 'terracotta.solid/70' : 'bg' }
                          color={ isSelected ? 'terracotta.contrast' : 'fg.muted' }
                          align="center"
                          justify="center"
                          boxShadow="sm"
                          borderWidth="thin"
                          borderColor="border.subtle"
                        >
                          <Box
                            as={ LuCheck }
                            boxSize={ 3.5 }
                          />
                        </Flex>
                      </Box>

                      <Stack
                        as="span"
                        gap={ 1 }
                      >
                        <Text
                          as="span"
                          display="block"
                          textStyle="xs"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          textTransform="uppercase"
                          color="fg.muted"
                          truncate
                        >
                          { product.brandName }
                        </Text>
                        <Text
                          as="span"
                          textStyle="sm"
                          lineClamp={ 2 }
                          minHeight="2lh"
                        >
                          { name }
                        </Text>
                        <Text
                          as="span"
                          display="block"
                          textStyle={ { base: 'sm', md: 'md' } }
                          fontWeight="bold"
                        >
                          { product.price ? `${ product.price.toLocaleString() } 원` : '' }
                        </Text>
                      </Stack>

                      { isSelected && (
                        <Box
                          as="span"
                          position="absolute"
                          inset={ 0 }
                          bg="terracotta.subtle/30"
                          pointerEvents="none"
                        />
                      ) }
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
