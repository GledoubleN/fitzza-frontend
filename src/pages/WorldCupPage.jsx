import { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Center,
  Button,
  Container,
  Grid,
  GridItem,
  Spinner,
  Table,
} from '@chakra-ui/react'
import { LuChevronLeft, LuRotateCcw, LuShare2, LuHistory } from 'react-icons/lu'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { Toaster, toaster } from '../components/ui/toaster.jsx'
import defaultHeroImage from '../assets/hero.png'

const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function WorldCupPage () {
  const location = useLocation()
  const navigate = useNavigate()

  const rawSelectedProducts = location.state?.selectedProducts || []

  const [viewMode, setViewMode] = useState('tournament')
  const [previousViewMode, setPreviousViewMode] = useState('tournament')
  const [matchList, setMatchList] = useState([])
  const [nextRoundList, setNextRoundList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roundTitle, setRoundTitle] = useState('월드컵')
  const [winnerProduct, setWinnerProduct] = useState(null)
  const [savedHistoryId, setSavedHistoryId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaveFailed, setIsSaveFailed] = useState(false)

  const [historyList, setHistoryList] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    if (rawSelectedProducts.length < 2) {
      navigate('/select')
      return
    }

    const shuffled = shuffle(rawSelectedProducts)
    setMatchList(shuffled)
    updateRoundTitle(shuffled.length)
  }, [location.state])

  const updateRoundTitle = (length) => {
    if (length <= 2) setRoundTitle('결승')
    else if (length <= 4) setRoundTitle('4강')
    else if (length <= 8) setRoundTitle('8강')
    else if (length <= 16) setRoundTitle('16강')
    else if (length <= 32) setRoundTitle('32강')
    else setRoundTitle('64강')
  }

  const hasBye = matchList.length % 2 !== 0 && currentIndex === matchList.length - 1
  const byeProduct = hasBye ? matchList[matchList.length - 1] : null

  useEffect(() => {
    if (hasBye && byeProduct) {
      const updatedNextRound = [...nextRoundList, byeProduct]
      const shuffledNext = shuffle(updatedNextRound)

      const timer = setTimeout(() => {
        setMatchList(shuffledNext)
        setNextRoundList([])
        setCurrentIndex(0)
        updateRoundTitle(shuffledNext.length)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, matchList.length, hasBye, byeProduct])

  const leftProduct = !hasBye ? matchList[currentIndex] : null
  const rightProduct = !hasBye ? matchList[currentIndex + 1] : null

  const saveWorldCupResult = async (winner, candidates) => {
    setIsSaving(true)
    setIsSaveFailed(false)

    try {
      const winnerId = winner.productId ?? winner.itemId
      const candidateIds = candidates.map(item => item.productId ?? item.itemId)

      const response = await api.post('/worldcups', {
        winnerProductId: winnerId,
        candidateProductIds: candidateIds,
      })

      if (response.data?.worldcupHistoryId) {
        setSavedHistoryId(response.data.worldcupHistoryId)
      }
    } catch (error) {
      console.warn('월드컵 결과 저장 실패:', error)
      setIsSaveFailed(true)
      toaster.create({
        title: '월드컵 결과를 저장하지 못했습니다.',
        type: 'error',
        closable: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const fetchHistoryList = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await api.get('/worldcups/history', {
        params: { page: 0, size: 20 },
      })

      if (response.data && response.data.content) {
        setHistoryList(response.data.content)
      }
    } catch (error) {
      console.warn('월드컵 이력 조회 실패:', error)
      toaster.create({
        title: '우승 이력을 불러오지 못했습니다.',
        type: 'error',
        closable: true,
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleSelect = async (selected) => {
    if (isSaving) return

    const updatedNextRound = [...nextRoundList, selected]
    const nextIndex = currentIndex + 2

    if (nextIndex >= matchList.length) {
      if (updatedNextRound.length === 1) {
        const winner = updatedNextRound[0]
        setWinnerProduct(winner)
        setViewMode('result')

        await saveWorldCupResult(winner, rawSelectedProducts)
      } else {
        const shuffledNext = shuffle(updatedNextRound)
        setMatchList(shuffledNext)
        setNextRoundList([])
        setCurrentIndex(0)
        updateRoundTitle(shuffledNext.length)
      }
    } else {
      setNextRoundList(updatedNextRound)
      setCurrentIndex(nextIndex)
    }
  }

  const handleRestart = () => {
    const shuffled = shuffle(rawSelectedProducts)
    setMatchList(shuffled)
    setNextRoundList([])
    setCurrentIndex(0)
    setWinnerProduct(null)
    setSavedHistoryId(null)
    setIsSaveFailed(false)
    setViewMode('tournament')
    updateRoundTitle(shuffled.length)
  }

  const handleShareToCommunity = () => {
    if (!savedHistoryId || !winnerProduct) return

    navigate('/community/write', {
      state: {
        sharedType: 'WORLDCUP',
        sharedId: savedHistoryId,
        snapshot: {
          productId: winnerProduct.productId,
          brandName: winnerProduct.brandName,
          productName: winnerProduct.productName,
          price: winnerProduct.price,
          imageUrl: winnerProduct.thumbnailUrl || winnerProduct.imageUrl || defaultHeroImage,
        },
      },
    })
  }

  const handleOpenHistory = () => {
    setPreviousViewMode(viewMode)
    fetchHistoryList()
    setViewMode('history')
  }

  if (viewMode === 'tournament' && (!leftProduct || !rightProduct)) {
    return null
  }

  if (viewMode === 'history') {
    return (
      <Box
        position="relative"
        minH="100vh"
        pt={ 24 }
        pb={ 28 }
        bg="bg"
      >
        <Box
          position="fixed"
          top={ 0 }
          left={ 0 }
          right={ 0 }
          zIndex={ 10 }
          bg="bg"
          px={ 5 }
          py={ 4 }
        >
          <Container
            maxW="7xl"
            mx="auto"
            px={ 0 }
          >
            <Header />
          </Container>
        </Box>

        <Container
          maxW="3xl"
          mx="auto"
          px={ 5 }
        >
          <Grid gap={ 6 }>
            <GridItem>
              <Flex
                align="center"
                gap={ 2 }
              >
                <IconButton
                  variant="ghost"
                  aria-label="이전 화면으로 돌아가기"
                  onClick={ () => setViewMode(previousViewMode) }
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
                gap={ 3 }
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
                        _hover={ { borderColor: 'border.emphasized', transform: 'translateY(-2px)' } }
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
                          <Image
                            src={ product?.thumbnailUrl || product?.imageUrl || defaultHeroImage }
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
                            mb={ 0.5 }
                            truncate
                          >
                            { product?.brandName }
                          </Text>
                          <Text
                            textStyle="sm"
                            fontWeight="bold"
                            truncate
                            mb={ 1 }
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
              </Grid>
            ) }
          </Grid>
        </Container>

        <Box
          position="fixed"
          bottom={ 0 }
          left={ 0 }
          right={ 0 }
          zIndex={ 10 }
          bg="bg"
        >
          <TabBar />
        </Box>

        <Toaster />
      </Box>
    )
  }

  if (viewMode === 'result' && winnerProduct) {
    const winnerId = winnerProduct.productId || winnerProduct.itemId

    return (
      <Box
        position="relative"
        minH="100vh"
        pt={ 24 }
        pb={ 28 }
        bg="bg"
      >
        <Box
          position="fixed"
          top={ 0 }
          left={ 0 }
          right={ 0 }
          zIndex={ 10 }
          bg="bg"
          px={ 5 }
          py={ 4 }
        >
          <Container
            maxW="7xl"
            mx="auto"
            px={ 0 }
          >
            <Header />
          </Container>
        </Box>

        <Container
          maxW="3xl"
          mx="auto"
          px={ 5 }
        >
          <Grid gap={ 6 }>
            <GridItem>
              <Flex
                align="center"
                justify="space-between"
              >
                <Flex
                  align="center"
                  gap={ 2 }
                >
                  <IconButton
                    variant="ghost"
                    aria-label="후보 선택 화면으로 돌아가기"
                    onClick={ () => navigate('/select') }
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
                    이상형 월드컵 결과
                  </Text>
                </Flex>
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="xl"
                  onClick={ handleOpenHistory }
                >
                  <Box
                    as={ LuHistory }
                    boxSize={ 4 }
                    mr={ 1.5 }
                  />
                  우승 이력 보기
                </Button>
              </Flex>
            </GridItem>

            <GridItem textAlign="center">
              <Text
                textStyle="md"
                fontWeight="bold"
              >
                당신의 최종 선택은?
              </Text>
            </GridItem>

            <GridItem
              textAlign="center"
              cursor="pointer"
              onClick={ () => navigate(`/products/${ winnerId }`) }
              _hover={ { opacity: 0.9 } }
              transition="opacity 0.2s"
            >
              <Box
                w="100%"
                h={ { base: 'sm', md: 'md' } }
                borderRadius="2xl"
                overflow="hidden"
                mb={ 4 }
                borderWidth="thin"
                borderColor="border.subtle"
                bg="bg.subtle"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={ winnerProduct.thumbnailUrl || winnerProduct.imageUrl || defaultHeroImage }
                  alt={ winnerProduct.productName || winnerProduct.name }
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Box>
              <Text
                textStyle="xl"
                fontWeight="bold"
                _hover={ { textDecoration: 'underline' } }
              >
                { winnerProduct.productName || winnerProduct.name }
              </Text>
              <Text
                textStyle="sm"
                color="fg.muted"
                mt={ 1 }
              >
                { winnerProduct.brandName }
              </Text>
            </GridItem>

            <GridItem
              borderWidth="thin"
              borderColor="border.subtle"
              borderRadius="2xl"
              p={ 5 }
              bg="bg.panel"
            >
              <Text
                textStyle="sm"
                fontWeight="bold"
                mb={ 4 }
                textAlign="center"
                color="fg.muted"
              >
                우승 상품 정보
              </Text>

              <Table.Root size="sm">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell
                      fontWeight="medium"
                      w="30%"
                      color="fg.muted"
                    >
                      가격
                    </Table.Cell>
                    <Table.Cell
                      textAlign="right"
                      fontWeight="bold"
                    >
                      { winnerProduct.price ? `${ winnerProduct.price.toLocaleString() }원` : '정보 없음' }
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell
                      fontWeight="medium"
                      color="fg.muted"
                    >
                      브랜드
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      { winnerProduct.brandName || '정보 없음' }
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </GridItem>

            { isSaveFailed && !savedHistoryId && (
              <GridItem textAlign="center">
                <Flex
                  direction="column"
                  align="center"
                  gap={ 2 }
                >
                  <Text
                    textStyle="xs"
                    color="fg.error"
                  >
                    결과 저장에 실패하여 커뮤니티에 공유할 수 없습니다.
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    loading={ isSaving }
                    onClick={ () => saveWorldCupResult(winnerProduct, rawSelectedProducts) }
                  >
                    결과 저장 다시 시도
                  </Button>
                </Flex>
              </GridItem>
            ) }

            <GridItem>
              <Grid
                templateColumns="1fr 1fr"
                gap={ 4 }
              >
                <Button
                  size="lg"
                  variant="outline"
                  borderRadius="xl"
                  onClick={ handleRestart }
                >
                  <Box
                    as={ LuRotateCcw }
                    boxSize={ 4 }
                    mr={ 2 }
                  />
                  다시 하기
                </Button>
                <Button
                  size="lg"
                  bg="fg"
                  color="bg"
                  borderRadius="xl"
                  disabled={ !savedHistoryId || isSaving }
                  _hover={ { opacity: 0.9 } }
                  onClick={ handleShareToCommunity }
                >
                  <Box
                    as={ LuShare2 }
                    boxSize={ 4 }
                    mr={ 2 }
                  />
                  커뮤니티에 공유
                </Button>
              </Grid>
            </GridItem>
          </Grid>
        </Container>

        <Box
          position="fixed"
          bottom={ 0 }
          left={ 0 }
          right={ 0 }
          zIndex={ 10 }
          bg="bg"
        >
          <TabBar />
        </Box>

        <Toaster />
      </Box>
    )
  }

  return (
    <Box
      position="relative"
      minH="100vh"
      pt={ 24 }
      pb={ 28 }
      bg="bg"
    >
      <Box
        position="fixed"
        top={ 0 }
        left={ 0 }
        right={ 0 }
        zIndex={ 10 }
        bg="bg"
        px={ 5 }
        py={ 4 }
      >
        <Container
          maxW="7xl"
          mx="auto"
          px={ 0 }
        >
          <Header />
        </Container>
      </Box>

      <Container
        maxW="3xl"
        mx="auto"
        px={ 5 }
      >
        <Grid gap={ 6 }>
          <GridItem>
            <Flex
              align="center"
              justify="space-between"
            >
              <Flex
                align="center"
                gap={ 2 }
              >
                <IconButton
                  variant="ghost"
                  aria-label="후보 선택 화면으로 돌아가기"
                  onClick={ () => navigate('/select') }
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
                  이상형 월드컵 ({ roundTitle })
                </Text>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
                onClick={ handleOpenHistory }
              >
                <Box
                  as={ LuHistory }
                  boxSize={ 4 }
                  mr={ 1.5 }
                />
                우승 이력 보기
              </Button>
            </Flex>
          </GridItem>

          <GridItem textAlign="center">
            <Text
              textStyle="md"
              fontWeight="medium"
              color="fg.muted"
            >
              마음에 드는 상품을 선택해 주세요 ({ Math.floor(currentIndex / 2) + 1 } / { Math.ceil(matchList.length / 2) })
            </Text>
          </GridItem>

          <GridItem>
            <Grid
              templateColumns="1fr auto 1fr"
              gap={ { base: 3, md: 4 } }
              alignItems="center"
              position="relative"
            >
              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={ { base: 3, md: 4 } }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                _hover={ { borderColor: 'border.emphasized', transform: 'translateY(-2px)' } }
                transition="all 0.2s"
                onClick={ () => handleSelect(leftProduct) }
              >
                <Box
                  w="100%"
                  h={ { base: '40', md: '60' } }
                  borderRadius="xl"
                  overflow="hidden"
                  mb={ 3 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ leftProduct?.thumbnailUrl || leftProduct?.imageUrl || defaultHeroImage }
                    alt={ leftProduct?.productName || leftProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  textStyle="xs"
                  color="fg.muted"
                  truncate
                  mb={ 1 }
                >
                  { leftProduct?.brandName }
                </Text>
                <Text
                  textStyle={ { base: 'xs', md: 'md' } }
                  fontWeight="bold"
                  textAlign="center"
                  truncate
                >
                  { leftProduct?.productName || leftProduct?.name }
                </Text>
              </GridItem>

              <GridItem zIndex={ 10 }>
                <Center
                  boxShadow="md"
                  borderRadius="full"
                  boxSize={ { base: 9, md: 12 } }
                  bg="bg.panel"
                  borderWidth="thin"
                  borderColor="border.subtle"
                >
                  <Text
                    textStyle={ { base: 'xs', md: 'sm' } }
                    fontWeight="bold"
                  >
                    VS
                  </Text>
                </Center>
              </GridItem>

              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={ { base: 3, md: 4 } }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                _hover={ { borderColor: 'border.emphasized', transform: 'translateY(-2px)' } }
                transition="all 0.2s"
                onClick={ () => handleSelect(rightProduct) }
              >
                <Box
                  w="100%"
                  h={ { base: '40', md: '60' } }
                  borderRadius="xl"
                  overflow="hidden"
                  mb={ 3 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ rightProduct?.thumbnailUrl || rightProduct?.imageUrl || defaultHeroImage }
                    alt={ rightProduct?.productName || rightProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  textStyle="xs"
                  color="fg.muted"
                  truncate
                  mb={ 1 }
                >
                  { rightProduct?.brandName }
                </Text>
                <Text
                  textStyle={ { base: 'xs', md: 'md' } }
                  fontWeight="bold"
                  textAlign="center"
                  truncate
                >
                  { rightProduct?.productName || rightProduct?.name }
                </Text>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem
            textAlign="center"
            pt={ 2 }
          >
            <Text
              textStyle="xs"
              color="fg.muted"
            >
              상품 정보는 판매처 기준입니다
            </Text>
          </GridItem>
        </Grid>
      </Container>

      <Box
        position="fixed"
        bottom={ 0 }
        left={ 0 }
        right={ 0 }
        zIndex={ 10 }
        bg="bg"
      >
        <TabBar />
      </Box>

      <Toaster />
    </Box>
  )
}