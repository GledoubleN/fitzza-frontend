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
import { LuCheck, LuChevronLeft, LuHistory } from 'react-icons/lu'
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

  const handleToggleSelect = (productId) => {
    if (!selectedProductIds.includes(productId) && selectedProductIds.length >= MAX_CANDIDATES) {
      toaster.create({
        title: `후보는 최대 ${ MAX_CANDIDATES }개까지만 선택할 수 있습니다.`,
        type: 'warning',
      })
      return
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
          justify="space-between"
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
              textStyle="lg"
              fontWeight="bold"
            >
              월드컵 후보 선택
            </Text>
          </Flex>
          <Button
            size="sm"
            variant="outline"
            onClick={ () => navigate('/worldcup/history', { state: { fromWorldCup: true } }) }
          >
            <LuHistory/>
            우승 이력 보기
          </Button>
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
                선택된 후보: { selectedProductIds.length } / { MAX_CANDIDATES }개
              </Text>
              <Button
                size="sm"
                bg="fg"
                color="bg"
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
                      display="flex"
                      flexDirection="column"
                      gap={ 3 }
                      padding={ 2 }
                      paddingBottom={ 3 }
                      textAlign="left"
                      cursor="pointer"
                      bg="bg.panel"
                      borderWidth="thin"
                      borderColor={ isSelected ? 'fg' : 'border.subtle' }
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

                        { isSelected && (
                          <Box
                            as="span"
                            display="block"
                            position="absolute"
                            inset={ 0 }
                            bg="bg.emphasized"
                            opacity={ 0.2 }
                          />
                        ) }

                        <Flex
                          as="span"
                          position="absolute"
                          top={ 2 }
                          right={ 2 }
                          boxSize={ 6 }
                          borderRadius="full"
                          bg={ isSelected ? 'fg' : 'bg' }
                          color={ isSelected ? 'bg' : 'fg.muted' }
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
