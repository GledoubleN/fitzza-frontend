import {
  Box,
  Flex,
  Text,
  IconButton,
  Center,
  Button,
  Grid,
  GridItem,
  Spinner,
  Container,
  Stack,
} from '@chakra-ui/react'
import { LuChevronLeft } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

const HISTORY_PAGE_SIZE = 20

export const WorldCupHistoryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [historyList, setHistoryList] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyPage, setHistoryPage] = useState(0)
  const [hasNextHistory, setHasNextHistory] = useState(false)
  const [isLoadingMoreHistory, setIsLoadingMoreHistory] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    api.get('/worldcups/history', {
      params: { page: 0, size: HISTORY_PAGE_SIZE },
      signal: controller.signal,
    }).then(({ data }) => {
      if (controller.signal.aborted) return
      setHistoryList(data.content)
      setHasNextHistory(data.hasNext)
    }).catch(() => {
      if (controller.signal.aborted) return
      toaster.create({ title: '우승 이력을 불러오지 못했습니다.', type: 'error' })
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoadingHistory(false)
    })

    return () => controller.abort()
  }, [])

  const loadMore = async () => {
    if (isLoadingMoreHistory || !hasNextHistory) return
    setIsLoadingMoreHistory(true)

    try {
      const page = historyPage + 1
      const { data } = await api.get('/worldcups/history', {
        params: { page, size: HISTORY_PAGE_SIZE },
      })
      setHistoryList(previous => [...previous, ...data.content])
      setHistoryPage(page)
      setHasNextHistory(data.hasNext)
    } catch {
      toaster.create({ title: '우승 이력을 불러오지 못했습니다.', type: 'error' })
    } finally {
      setIsLoadingMoreHistory(false)
    }
  }

  const goBack = () => {
    if (location.state?.fromWorldCup) {
      navigate(-1)
      return
    }
    navigate('/worldcup/setup', { replace: true })
  }

  return (
    <Stack
      gap={ 4 }
      paddingY={ 4 }
      minHeight="100vh"
    >
      <Header/>
      <Container
        maxWidth="5xl"
        flex={ 1 }
      >
        <Grid gap={ 8 }>
          <GridItem>
            <Flex
              align="center"
              gap={ 4 }
            >
              <IconButton
                variant="ghost"
                aria-label="이전 화면으로 돌아가기"
                onClick={ goBack }
              >
                <Box
                  as={ LuChevronLeft }
                  boxSize={ 6 }
                />
              </IconButton>
              <Text
                textStyle="lg"
                fontWeight="bold"
              >
                이상형 월드컵 우승 이력
              </Text>
            </Flex>
          </GridItem>

          { isLoadingHistory ? (
            <Center py={ 20 }>
              <Spinner size="lg" />
            </Center>
          ) : historyList.length === 0 ? (
            <Center
              py={ 20 }
              flexDirection="column"
              gap={ 4 }
            >
              <Text
                textStyle="md"
                color="fg.muted"
              >
                아직 완료된 월드컵 우승 이력이 없습니다.
              </Text>
            </Center>
          ) : (
            <Grid gap={ 4 }>
              {
                historyList.map((item) => {
                  const product = item.winnerProduct
                  const productId = product?.productId || product?.itemId
                  const formattedDate = item.completedAt
                    ? new Date(item.completedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    : ''

                  return (
                    <GridItem
                      key={ item.worldcupHistoryId }
                      borderWidth="thin"
                      borderColor="border.subtle"
                      borderRadius="2xl"
                      p={ 4 }
                      bg="bg.panel"
                      display="flex"
                      alignItems="center"
                      gap={ 4 }
                      cursor="pointer"
                      _hover={ { borderColor: 'border.emphasized', transform: 'translateY(calc(-1 * {spacing.1}))' } }
                      transition="all 0.2s"
                      onClick={ () => productId && navigate(`/products/${ productId }`) }
                    >
                      <Box
                        w="20"
                        h="20"
                        borderRadius="xl"
                        overflow="hidden"
                        bg="bg.subtle"
                        flexShrink={ 0 }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ProductImage
                          src={ product?.thumbnailUrl || product?.imageUrl }
                          alt={ product?.productName || product?.name }
                          w="100%"
                          h="100%"
                          objectFit="contain"
                        />
                      </Box>

                      <Box
                        flex="1"
                        overflow="hidden"
                      >
                        <Text
                          textStyle="xs"
                          color="fg.muted"
                          truncate
                        >
                          { product?.brandName }
                        </Text>
                        <Text
                          textStyle="sm"
                          fontWeight="bold"
                          truncate
                        >
                          { product?.productName || product?.name }
                        </Text>
                        <Text
                          textStyle="xs"
                          color="fg.subtle"
                        >
                          우승일: { formattedDate }
                        </Text>
                      </Box>
                    </GridItem>
                  )
                })
              }

              { hasNextHistory && (
                <Button
                  variant="outline"
                  loading={ isLoadingMoreHistory }
                  onClick={ loadMore }
                >
                  더 보기
                </Button>
              ) }
            </Grid>
          ) }
        </Grid>
      </Container>
      <TabBar/>
    </Stack>
  )
}
