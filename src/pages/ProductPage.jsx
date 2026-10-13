import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Image,
  Spinner,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { LuChevronRight, LuHeart } from 'react-icons/lu'
import { api } from '../api/axios.js'
import { AppBar } from '../components/AppBar.jsx'
import { Toaster, toaster } from '../components/ui/toaster.jsx'
import { ProductOptionSelector } from './product/ProductOptionSelector.jsx'
import { ProductReviewTab } from './product/ProductReviewTab.jsx'
import { ProductSizeTab } from './product/ProductSizeTab.jsx'

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
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWished, setIsWished] = useState(false)

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
    if (!localStorage.getItem('accessToken')) {
      navigate('/signin')
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
        <AppBar></AppBar>
        <Container maxWidth={ '5xl' } paddingY={ 20 } centerContent>
          { isLoading ? <Spinner/> : <Text color={ 'fg.muted' }>상품을 찾을 수 없어요.</Text> }
        </Container>
      </Stack>
    )
  }

  return (
    <Stack minHeight={ '100%' } direction={ 'column' } paddingY={ 4 } gap={ 4 }>
      <AppBar></AppBar>

      <Container maxWidth={ '5xl' } flex={ '1' }>
        <Grid templateColumns={ { base: '1fr', md: '2fr 1fr' } } gap={ 4 }>
          <GridItem minWidth={ 0 }>
            <Container maxWidth={ 'xl' } paddingX={ 0 }>
              <Image
                width={ '100%' }
                aspectRatio={ 'square' }
                objectFit={ 'cover' }
                rounded={ 'l3' }
                bg={ 'bg.muted' }
                src={ product.thumbnailUrl ?? product.images?.[0] }
                alt={ product.productName }
              ></Image>
            </Container>
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
              <Button variant={ 'outline' } size={ 'lg' } justifyContent={ 'space-between' } onClick={ () => navigate('/try-on') }>
                <Flex align={ 'center' } gap={ 2 }>
                  <Text textStyle={'sm'}>이 옷, 내 몸엔 어떤 핏일까?</Text>
                </Flex>
                <Flex align={ 'center' } gap={ 1 } color={ 'fg.muted' }>
                  <Text textStyle={ 'sm' }  fontWeight={'bold'} >바로입기</Text>
                  <Icon size={ 'sm' }><LuChevronRight/></Icon>
                </Flex>
              </Button>
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
                  <Tabs.Trigger value={ 'inquiry' }>문의</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={ 'information' }>
                  <Stack gap={ 4 } paddingY={ 4 }>
                    <Text whiteSpace={ 'pre-wrap' }>{ product.description || '정보가 없습니다.' }</Text>
                    { product.images?.map((image) => (
                      <Image key={ image } width={ '100%' } src={ image } alt={ product.productName }></Image>
                    )) }
                  </Stack>
                </Tabs.Content>
                <Tabs.Content value={ 'size' }>
                  <ProductSizeTab product={ product }/>
                </Tabs.Content>
                <Tabs.Content value={ 'review' }>
                  <ProductReviewTab productId={ product.productId }/>
                </Tabs.Content>
                <Tabs.Content value={ 'inquiry' }>
                  <Text paddingY={ 4 } color={ 'fg.muted' }>상품 문의는 준비 중이에요.</Text>
                </Tabs.Content>
              </Tabs.Root>
            </Stack>
          </GridItem>
        </Grid>
      </Container>

      <Toaster/>
    </Stack>
  )
}
