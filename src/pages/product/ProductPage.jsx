import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { LuArrowUp, LuHeart } from 'react-icons/lu'
import { api } from '../../api/axios.js'
import { useAuth } from '../../contexts/AuthContext.js'
import { Header } from '../../components/Header.jsx'
import { SignInRequiredDialog } from '../../components/SignInRequiredDialog.jsx'
import { ScrollToTopButton } from '../../components/ScrollToTopButton.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { ProductInformationTab } from './ProductInformationTab.jsx'
import { ProductOptionSelector } from './ProductOptionSelector.jsx'
import { ProductReviewTab } from './ProductReviewTab.jsx'
import { ProductSizeTab } from './ProductSizeTab.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

function getEstimatedArrivalDate () {
  const date = new Date()
  const ESTIMATED_SHIPPING = 3
  date.setDate(date.getDate() + ESTIMATED_SHIPPING)

  return (
    date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).replace(/\. \(/, ' (')
  )
}

export const ProductPage = () => {
  const { isSignedIn } = useAuth()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWished, setIsWished] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let ignore = false
    api.get(`/products/${ id }`)
      .then((response) => {
        if (ignore) return
        setProduct(response.data)
        setIsWished(!!response.data.wished)
      })
      .catch(() => !ignore && setProduct(null))
      .finally(() => !ignore && setIsLoading(false))

    return () => { ignore = true }
  }, [id])

  const toggleWish = async () => {
    if (!isSignedIn) {
      setIsSignInDialogOpen(true)
      return
    }

    const next = !isWished
    setIsWished(next)
    try {
      if (next) {
        await api.post('/wishlists', { itemId: product.productId })
      } else {
        await api.delete('/wishlists', { params: { itemId: product.productId } })
      }
    } catch {
      setIsWished(!next)
      toaster.create({ type: 'error', title: '찜을 변경하지 못했어요.' })
    }
  }

  if (isLoading || !product) {
    return (
      <Stack height={ '100%' } paddingY={ 4 } gap={ 4 }>
        <Header></Header>
        <Container maxWidth={ '5xl' } paddingY={ 20 } centerContent>
          { isLoading ? <Spinner/> : <Text color={ 'fg.muted' }>상품을 찾을 수 없어요.</Text> }
        </Container>
      </Stack>
    )
  }

  return (
    <Stack minHeight={ '100%' } direction={ 'column' } paddingY={ 4 } gap={ 4 }>
      <Header></Header>

      <Container maxWidth={ '5xl' } flex={ '1' }>
        <Grid templateColumns={ { base: '1fr', md: '2fr 1fr' } } gap={ 4 }>
          <GridItem minWidth={ 0 }>
            <ProductImage
              width={ '100%' }
              aspectRatio={ 'square' }
              objectFit={ 'contain' }
              rounded={ 'l3' }
              bg={ 'bg.muted' }
              src={ product.thumbnailUrl || product.images?.[0] }
              alt={ product.productName }
            ></ProductImage>
          </GridItem>

          <GridItem
            gridColumn={ { md: 2 } }
            gridRow={ { md: '1 / span 2' } }
            position={ { md: 'sticky' } }
            top={ 4 }
            alignSelf="start"
          >
            <Stack gap={ 4 }>
              <Stack gap={ 2 }>
                <Text textStyle={ 'sm' } color={ 'fg.muted' }>{ product.brandName }</Text>
                <Flex justify={ 'space-between' } align={ 'start' } gap={ 2 }>
                  <Heading size={ { base: 'md', md: 'xl' } }>{ product.productName }</Heading>
                  <IconButton
                    variant={ 'ghost' }
                    rounded={ 'full' }
                    aria-label={ '찜' }
                    aria-pressed={ isWished }
                    color={ isWished ? 'primary.solid' : undefined }
                    onClick={ toggleWish }
                  >
                    <LuHeart fill={ isWished ? 'currentColor' : 'none' }/>
                  </IconButton>
                </Flex>
                <Text textStyle={ 'xl' } fontWeight={ 'bold' }>
                  { product.price != null ? `${ product.price.toLocaleString() }원` : '정보가 없습니다.' }
                </Text>
              </Stack>
              <ProductOptionSelector product={ product }/>
            </Stack>
          </GridItem>

          <GridItem minWidth={ 0 } gridColumn={ { md: 1 } }>
            <Stack gap={ 4 }>
              <Card.Root>
                <Card.Body>
                  <Stack>
                    <Text fontSize={ 'sm' }>{ getEstimatedArrivalDate() } 도착 예정 · 도착 확률 99%</Text>
                    <Text fontSize={ 'sm' }>결제 3일 이내 발송 예정 · 우체국택배</Text>
                  </Stack>
                </Card.Body>
              </Card.Root>

              <Tabs.Root defaultValue={ 'information' } fitted lazyMount>
                <Tabs.List>
                  <Tabs.Trigger value={ 'information' }>정보</Tabs.Trigger>
                  <Tabs.Trigger value={ 'size' }>사이즈</Tabs.Trigger>
                  <Tabs.Trigger value={ 'review' }>후기</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={ 'information' }>
                  <ProductInformationTab product={ product }/>
                </Tabs.Content>
                <Tabs.Content value={ 'size' }>
                  <ProductSizeTab product={ product }/>
                </Tabs.Content>
                <Tabs.Content value={ 'review' }>
                  <ProductReviewTab productId={ product.productId }/>
                </Tabs.Content>
              </Tabs.Root>

              {/* 넓은 화면에서는 맨 위로 버튼을 상세 정보 열 안쪽 아래에 붙인다. */ }
              { isScrolled && (
                <Flex
                  display={ { base: 'none', md: 'flex' } }
                  position={ 'sticky' }
                  bottom={ 8 }
                  height={ 0 }
                  justify={ 'flex-end' }
                  align={ 'flex-end' }
                >
                  <IconButton
                    rounded={ 'full' }
                    aria-label={ '맨 위로' }
                    onClick={ () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
                  >
                    <LuArrowUp/>
                  </IconButton>
                </Flex>
              ) }
            </Stack>
          </GridItem>
        </Grid>
      </Container>

      {/* 이 화면에는 하단 탭 바가 없어 기본값보다 아래에 둔다. */ }
      <Box display={ { md: 'none' } }>
        <ScrollToTopButton bottom={ '8' }/>
      </Box>
      <SignInRequiredDialog open={ isSignInDialogOpen } onClose={ () => setIsSignInDialogOpen(false) }/>
    </Stack>
  )
}
