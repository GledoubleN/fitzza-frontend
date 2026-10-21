import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { LuChevronLeft, LuRotateCcw, LuShare2, LuHistory } from 'react-icons/lu';
import { Header } from '../components/Header.jsx';
import { TabBar } from '../components/TabBar.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/axios.js';

export default function WorldCupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const rawSelectedProducts = location.state?.selectedProducts || [];

  const [viewMode, setViewMode] = useState('tournament');
  const [matchList, setMatchList] = useState([]);
  const [nextRoundList, setNextRoundList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundTitle, setRoundTitle] = useState('월드컵');
  const [winnerProduct, setWinnerProduct] = useState(null);

  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (rawSelectedProducts.length < 2) {
      navigate('/select');
      return;
    }

    const shuffled = [...rawSelectedProducts].sort(() => Math.random() - 0.5);
    setMatchList(shuffled);
    updateRoundTitle(shuffled.length);
  }, [location.state]);

  const updateRoundTitle = (length) => {
    if (length === 2) setRoundTitle('결승');
    else if (length === 3) setRoundTitle('준결승 (3강)');
    else if (length <= 4) setRoundTitle('4강');
    else if (length <= 8) setRoundTitle('8강');
    else if (length <= 16) setRoundTitle('16강');
    else setRoundTitle(`${length}강`);
  };

  const hasBye = matchList.length % 2 !== 0 && currentIndex === matchList.length - 1;
  const byeProduct = hasBye ? matchList[matchList.length - 1] : null;

  useEffect(() => {
    if (hasBye && byeProduct) {
      const updatedNextRound = [...nextRoundList, byeProduct];
      const shuffledNext = [...updatedNextRound].sort(() => Math.random() - 0.5);

      const timer = setTimeout(() => {
        setMatchList(shuffledNext);
        setNextRoundList([]);
        setCurrentIndex(0);
        updateRoundTitle(shuffledNext.length);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, matchList.length, hasBye, byeProduct]);

  const leftProduct = !hasBye ? matchList[currentIndex] : null;
  const rightProduct = !hasBye ? matchList[currentIndex + 1] : null;

  // 💡 실제 백엔드 요청 시도 후 실패 시 프론트엔드 자체 Fallback 처리
  const saveWorldCupResult = async (winner, candidates) => {
    try {
      const winnerId = winner.productId ?? winner.itemId;
      const candidateIds = candidates.map(item => item.productId ?? item.itemId);

      // 1차: 실제 백엔드(또는 MSW) 통신 시도
      await api.post('/worldcups', {
        winnerProductId: winnerId,
        candidateProductIds: candidateIds,
      });
    } catch (error) {
      console.warn('실제 서버 통신 실패, 프론트엔드 로컬 Fallback 저장소로 대체합니다.', error);

      // 2차 Fallback: 백엔드/MSW 통신 실패 시 로컬스토리지에 강제 저장하여 이력 유지
      const localHistory = JSON.parse(localStorage.getItem('local_worldcup_histories') || '[]');
      const newHistory = {
        worldcupHistoryId: Date.now(),
        winnerProduct: {
          productId: winner.productId ?? winner.itemId,
          brandName: winner.brandName || '',
          productName: winner.productName || winner.name || '',
          price: winner.price || 0,
          imageUrl: winner.thumbnailUrl || winner.imageUrl || winner.image || '/src/assets/hero.png',
          status: 'ON_SALE'
        },
        completedAt: new Date().toISOString()
      };
      localHistory.unshift(newHistory);
      localStorage.setItem('local_worldcup_histories', JSON.stringify(localHistory));
    }
  };

  // 💡 우승 이력 조회 (실제 통신 실패 시 로컬스토리지 Fallback 병행)
  const fetchHistoryList = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await api.get('/worldcups/history', {
        params: { page: 0, size: 20 },
      });

      // 서버에서 정상 응답이 오면 데이터 사용
      if (response.data && response.data.content) {
        setHistoryList(response.data.content);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.warn('실제 서버 이력 조회 실패, 로컬 Fallback 데이터를 불러옵니다.', error);

      // Fallback: 로컬스토리지에 저장된 이력 불러오기
      const localHistory = JSON.parse(localStorage.getItem('local_worldcup_histories') || '[]');
      setHistoryList(localHistory);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSelect = async (selected) => {
    const updatedNextRound = [...nextRoundList, selected];
    const nextIndex = currentIndex + 2;

    if (nextIndex >= matchList.length) {
      if (updatedNextRound.length === 1) {
        const winner = updatedNextRound[0];
        setWinnerProduct(winner);
        setViewMode('result');

        await saveWorldCupResult(winner, rawSelectedProducts);
      } else {
        const shuffledNext = [...updatedNextRound].sort(() => Math.random() - 0.5);
        setMatchList(shuffledNext);
        setNextRoundList([]);
        setCurrentIndex(0);
        updateRoundTitle(shuffledNext.length);
      }
    } else {
      setNextRoundList(updatedNextRound);
      setCurrentIndex(nextIndex);
    }
  };

  const handleRestart = () => {
    const shuffled = [...rawSelectedProducts].sort(() => Math.random() - 0.5);
    setMatchList(shuffled);
    setNextRoundList([]);
    setCurrentIndex(0);
    setWinnerProduct(null);
    setViewMode('tournament');
    updateRoundTitle(shuffled.length);
  };

  if (viewMode === 'tournament' && (!leftProduct || !rightProduct)) {
    return null;
  }

  // ==================== [1. 우승 이력 조회 화면] ====================
  if (viewMode === 'history') {
    return (
      <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
        <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
          <Container maxW="7xl" mx="auto" px={0}>
            <Header />
          </Container>
        </Box>

        <Container maxW="3xl" mx="auto" px={5}>
          <Grid gap={6}>
            <GridItem>
              <Flex align="center" gap={2}>
                <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => setViewMode('result')}>
                  <Box as={LuChevronLeft} boxSize={6} />
                </IconButton>
                <Text textStyle="lg" fontWeight="bold">
                  이상형 월드컵 우승 이력
                </Text>
              </Flex>
            </GridItem>

            {isLoadingHistory ? (
              <Center py={20}>
                <Spinner size="lg" />
              </Center>
            ) : historyList.length === 0 ? (
              <Center py={20} flexDirection="column" gap={3}>
                <Text textStyle="md" color="fg.muted">
                  아직 완료된 월드컵 우승 이력이 없습니다.
                </Text>
              </Center>
            ) : (
              <Grid gap={4}>
                {historyList.map((item) => {
                  const product = item.winnerProduct;
                  const productId = product?.productId || product?.itemId;
                  const formattedDate = item.completedAt
                    ? new Date(item.completedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    : '';

                  return (
                    <GridItem
                      key={item.worldcupHistoryId || Math.random()}
                      borderWidth="thin"
                      borderColor="border.subtle"
                      borderRadius="2xl"
                      p={4}
                      bg="bg.panel"
                      display="flex"
                      alignItems="center"
                      gap={4}
                      cursor="pointer"
                      _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                      onClick={() => productId && navigate(`/products/${productId}`)}
                    >
                      <Box
                        w="20"
                        h="20"
                        borderRadius="xl"
                        overflow="hidden"
                        bg="bg.subtle"
                        flexShrink={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image
                          src={product?.thumbnailUrl || product?.imageUrl || product?.image}
                          alt={product?.productName || product?.name}
                          w="100%"
                          h="100%"
                          objectFit="contain"
                        />
                      </Box>

                      <Box flex="1" overflow="hidden">
                        <Text textStyle="xs" color="fg.muted" mb={0.5} truncate>
                          {product?.brandName}
                        </Text>
                        <Text textStyle="sm" fontWeight="bold" truncate mb={1}>
                          {product?.productName || product?.name}
                        </Text>
                        <Text textStyle="xs" color="fg.subtle">
                          우승일: {formattedDate}
                        </Text>
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
            )}
          </Grid>
        </Container>

        <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
          <TabBar />
        </Box>
      </Box>
    );
  }

  // ==================== [2. 결승 우승 결과 화면] ====================
  if (viewMode === 'result' && winnerProduct) {
    const winnerId = winnerProduct.productId || winnerProduct.itemId;

    return (
      <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
        <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
          <Container maxW="7xl" mx="auto" px={0}>
            <Header />
          </Container>
        </Box>

        <Container maxW="3xl" mx="auto" px={5}>
          <Grid gap={6}>
            <GridItem>
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={2}>
                  <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => navigate('/select')}>
                    <Box as={LuChevronLeft} boxSize={6} />
                  </IconButton>
                  <Text textStyle="lg" fontWeight="bold">
                    이상형 월드컵 결과
                  </Text>
                </Flex>
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="xl"
                  onClick={() => {
                    fetchHistoryList();
                    setViewMode('history');
                  }}
                >
                  <Box as={LuHistory} boxSize={4} mr={1.5} />
                  우승 이력 보기
                </Button>
              </Flex>
            </GridItem>

            <GridItem textAlign="center">
              <Text textStyle="md" fontWeight="bold">
                🎉 당신의 최종 선택은? 🎉
              </Text>
            </GridItem>

            <GridItem
              textAlign="center"
              cursor="pointer"
              onClick={() => navigate(`/products/${winnerId}`)}
              _hover={{ opacity: 0.9 }}
              transition="opacity 0.2s"
            >
              <Box
                w="100%"
                h={{ base: 'sm', md: 'md' }}
                borderRadius="2xl"
                overflow="hidden"
                mb={4}
                borderWidth="thin"
                borderColor="border.subtle"
                bg="bg.subtle"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={winnerProduct.thumbnailUrl || winnerProduct.imageUrl || winnerProduct.image}
                  alt={winnerProduct.productName || winnerProduct.name}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Box>
              <Text textStyle="xl" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                {winnerProduct.productName || winnerProduct.name}
              </Text>
              <Text textStyle="sm" color="fg.muted" mt={1}>
                {winnerProduct.brandName}
              </Text>
            </GridItem>

            <GridItem borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={5} bg="bg.panel">
              <Text textStyle="sm" fontWeight="bold" mb={4} textAlign="center" color="fg.muted">
                우승 상품 정보
              </Text>
              <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                <Box as="tbody">
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" w="30%" textAlign="left" py={2.5} pl={2} textStyle="sm">가격</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>
                      {winnerProduct.price ? `${winnerProduct.price.toLocaleString()}원` : '정보 없음'}
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" textAlign="left" py={2.5} pl={2} textStyle="sm">브랜드</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>{winnerProduct.brandName || '정보 없음'}</Box>
                  </Box>
                </Box>
              </Box>
            </GridItem>

            <GridItem>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Button
                  size="lg"
                  variant="outline"
                  borderRadius="xl"
                  onClick={handleRestart}
                >
                  <Box as={LuRotateCcw} boxSize={4} mr={2} />
                  다시 하기
                </Button>
                <Button
                  size="lg"
                  bg="black"
                  color="white"
                  borderRadius="xl"
                  _hover={{ bg: 'gray.800' }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('링크가 복사되었습니다!');
                  }}
                >
                  <Box as={LuShare2} boxSize={4} mr={2} />
                  결과 공유
                </Button>
              </Grid>
            </GridItem>
          </Grid>
        </Container>

        <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
          <TabBar />
        </Box>
      </Box>
    );
  }

  // ==================== [3. 토너먼트 진행 화면] ====================
  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <Header />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5}>
        <Grid gap={6}>
          <GridItem>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => navigate('/select')}>
                  <Box as={LuChevronLeft} boxSize={6} />
                </IconButton>
                <Text textStyle="lg" fontWeight="bold">
                  이상형 월드컵 ({roundTitle})
                </Text>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
                onClick={() => {
                  fetchHistoryList();
                  setViewMode('history');
                }}
              >
                <Box as={LuHistory} boxSize={4} mr={1.5} />
                우승 이력 보기
              </Button>
            </Flex>
          </GridItem>

          <GridItem textAlign="center">
            <Text textStyle="md" fontWeight="medium" color="fg.muted">
              마음에 드는 상품을 선택해 주세요 ({Math.floor(currentIndex / 2) + 1} / {Math.ceil(matchList.length / 2)})
            </Text>
          </GridItem>

          <GridItem>
            <Grid templateColumns="1fr auto 1fr" gap={{ base: 3, md: 4 }} alignItems="center" position="relative">
              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={{ base: 3, md: 4 }}
                cursor="pointer"
                bg="bg.panel"
                _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => handleSelect(leftProduct)}
              >
                <Box
                  w="100%"
                  h={{ base: '40', md: '60' }}
                  borderRadius="xl"
                  overflow="hidden"
                  mb={3}
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={leftProduct?.thumbnailUrl || leftProduct?.imageUrl || leftProduct?.image}
                    alt={leftProduct?.productName || leftProduct?.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text textStyle="xs" color="fg.muted" truncate mb={1}>{leftProduct?.brandName}</Text>
                <Text textStyle={{ base: 'xs', md: 'md' }} fontWeight="bold" textAlign="center" truncate>
                  {leftProduct?.productName || leftProduct?.name}
                </Text>
              </GridItem>

              <GridItem zIndex="10">
                <Center
                  boxShadow="md"
                  borderRadius="full"
                  boxSize={{ base: 9, md: 12 }}
                  bg="bg.panel"
                  borderWidth="thin"
                  borderColor="border.subtle"
                >
                  <Text textStyle={{ base: 'xs', md: 'sm' }} fontWeight="bold">
                    VS
                  </Text>
                </Center>
              </GridItem>

              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={{ base: 3, md: 4 }}
                cursor="pointer"
                bg="bg.panel"
                _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => handleSelect(rightProduct)}
              >
                <Box
                  w="100%"
                  h={{ base: '40', md: '60' }}
                  borderRadius="xl"
                  overflow="hidden"
                  mb={3}
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={rightProduct?.thumbnailUrl || rightProduct?.imageUrl || rightProduct?.image}
                    alt={rightProduct?.productName || rightProduct?.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text textStyle="xs" color="fg.muted" truncate mb={1}>{rightProduct?.brandName}</Text>
                <Text textStyle={{ base: 'xs', md: 'md' }} fontWeight="bold" textAlign="center" truncate>
                  {rightProduct?.productName || rightProduct?.name}
                </Text>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem textAlign="center" pt={2}>
            <Text textStyle="xs" color="fg.muted">
              상품 정보는 판매처 기준입니다
            </Text>
          </GridItem>
        </Grid>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  );
}