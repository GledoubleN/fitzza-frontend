import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  HStack,
  Center,
  Button,
  Container,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { LuChevronLeft, LuRotateCcw, LuShare2 } from 'react-icons/lu';
import { Header } from '../components/Header.jsx';
import { TabBar } from '../components/TabBar.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

export default function WorldCupPage () {
  const location = useLocation();
  const navigate = useNavigate();

  // SelectPage에서 넘겨준 선택된 상품 목록
  const rawSelectedProducts = location.state?.selectedProducts || [];

  // 토너먼트 상태 관리
  const [matchList, setMatchList] = useState([]); // 현재 라운드의 대진 후보들
  const [nextRoundList, setNextRoundList] = useState([]); // 다음 라운드로 진출할 승자들
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 매치의 인덱스
  const [roundTitle, setRoundTitle] = useState('월드컵'); // 결승, 4강, 8강 등

  const [isFinished, setIsFinished] = useState(false);
  const [winnerProduct, setWinnerProduct] = useState(null);

  // 컴포넌트 마운트 시 데이터 초기화 및 셔플 (랜덤 대진)
  useEffect(() => {
    if (rawSelectedProducts.length < 2) {
      navigate('/select');
      return;
    }

    const shuffled = [...rawSelectedProducts].sort(() => Math.random() - 0.5);
    setMatchList(shuffled);
    updateRoundTitle(shuffled.length);
  }, [location.state]);

  // 남은 후보 수에 따라 라운드 이름 결정
  const updateRoundTitle = (length) => {
    if (length === 2) setRoundTitle('결승');
    else if (length === 3) setRoundTitle('준결승 (3강)');
    else if (length <= 4) setRoundTitle('4강');
    else if (length <= 8) setRoundTitle('8강');
    else if (length <= 16) setRoundTitle('16강');
    else setRoundTitle(`${length}강`);
  };

  // 💡 [핵심 수정] 만약 현재 매치 리스트가 홀수 개(예: 3개)이고 마지막 1개만 남았다면,
  // 그 1개는 자동으로 다음 라운드(결승) 진출자로 빼놓습니다.
  const hasBye = matchList.length % 2 !== 0 && currentIndex === matchList.length - 1;
  const byeProduct = hasBye ? matchList[matchList.length - 1] : null;

  // 부전승 상태라면 경기를 치르지 않고 바로 다음 라운드로 합류시킴
  useEffect(() => {
    if (hasBye && byeProduct) {
      const updatedNextRound = [...nextRoundList, byeProduct];
      const shuffledNext = [...updatedNextRound].sort(() => Math.random() - 0.5);

      // 잠시 대기 후 다음 라운드로 전환
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

  // 상품 선택 시 처리
  const handleSelect = (selected) => {
    const updatedNextRound = [...nextRoundList, selected];
    const nextIndex = currentIndex + 2;

    // 현재 라운드의 모든 매치가 끝났을 때
    if (nextIndex >= matchList.length) {
      // 다음 진출자가 단 1명뿐이라면 그게 최종 우승!
      if (updatedNextRound.length === 1) {
        setWinnerProduct(updatedNextRound[0]);
        setIsFinished(true);
      } else {
        // 다음 라운드로 갱신 (무작위 셔플)
        const shuffledNext = [...updatedNextRound].sort(() => Math.random() - 0.5);
        setMatchList(shuffledNext);
        setNextRoundList([]);
        setCurrentIndex(0);
        updateRoundTitle(shuffledNext.length);
      }
    } else {
      // 아직 현재 라운드 매치가 남음
      setNextRoundList(updatedNextRound);
      setCurrentIndex(nextIndex);
    }
  };

  // 다시 하기
  const handleRestart = () => {
    const shuffled = [...rawSelectedProducts].sort(() => Math.random() - 0.5);
    setMatchList(shuffled);
    setNextRoundList([]);
    setCurrentIndex(0);
    setWinnerProduct(null);
    setIsFinished(false);
    updateRoundTitle(shuffled.length);
  };

  if (!isFinished && (!leftProduct || !rightProduct)) {
    return null; // 부전승 전환 중 빈 화면 방지
  }

  // ==================== [결승 우승 결과 화면] ====================
  if (isFinished && winnerProduct) {
    return (
      <Box position="relative" minH="100vh" pt={ 24 } pb={ 28 } bg="bg">
        <Box position="fixed" top={ 0 } left={ 0 } right={ 0 } zIndex={ 10 } bg="bg" px={ 5 } py={ 4 }>
          <Container maxW="7xl" mx="auto" px={ 0 }>
            <Header />
          </Container>
        </Box>

        <Container maxW="3xl" mx="auto" px={ 5 }>
          <Grid gap={ 6 }>
            <GridItem>
              <Flex align="center" gap={ 2 }>
                <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => navigate('/select')}>
                  <Box as={ LuChevronLeft } boxSize={ 6 } />
                </IconButton>
                <Text textStyle="lg" fontWeight="bold">
                  이상형 월드컵 결과
                </Text>
              </Flex>
            </GridItem>

            <GridItem textAlign="center">
              <Text textStyle="md" fontWeight="bold">
                🎉 당신의 최종 선택은? 🎉
              </Text>
            </GridItem>

            <GridItem textAlign="center">
              <Box
                w="100%"
                h={{ base: 'sm', md: 'md' }}
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
                  src={ winnerProduct.thumbnailUrl || winnerProduct.imageUrl || winnerProduct.image }
                  alt={ winnerProduct.productName || winnerProduct.name }
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Box>
              <Text textStyle="xl" fontWeight="bold">
                { winnerProduct.productName || winnerProduct.name }
              </Text>
              <Text textStyle="sm" color="fg.muted" mt={ 1 }>
                { winnerProduct.brandName }
              </Text>
            </GridItem>

            {/* 우승 상품 스펙 요약 */}
            <GridItem borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={ 5 } bg="bg.panel">
              <Text textStyle="sm" fontWeight="bold" mb={ 4 } textAlign="center" color="fg.muted">
                우승 상품 정보
              </Text>
              <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                <Box as="tbody">
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" w="30%" textAlign="left" py={ 2.5 } pl={ 2 } textStyle="sm">가격</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={ 2.5 } pr={ 2 }>
                      { winnerProduct.price ? `${winnerProduct.price.toLocaleString()}원` : '정보 없음' }
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" textAlign="left" py={ 2.5 } pl={ 2 } textStyle="sm">브랜드</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={ 2.5 } pr={ 2 }>{ winnerProduct.brandName || '정보 없음' }</Box>
                  </Box>
                </Box>
              </Box>
            </GridItem>

            <GridItem>
              <Grid templateColumns="1fr 1fr" gap={ 4 }>
                <Button
                  size="lg"
                  variant="outline"
                  borderRadius="xl"
                  onClick={ handleRestart }
                >
                  <Box as={ LuRotateCcw } boxSize={ 4 } mr={ 2 } />
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
                  <Box as={ LuShare2 } boxSize={ 4 } mr={ 2 } />
                  결과 공유
                </Button>
              </Grid>
            </GridItem>
          </Grid>
        </Container>

        <Box position="fixed" bottom={ 0 } left={ 0 } right={ 0 } zIndex={ 10 } bg="bg">
          <TabBar />
        </Box>
      </Box>
    );
  }

  // ==================== [토너먼트 진행 화면] ====================
  return (
    <Box position="relative" minH="100vh" pt={ 24 } pb={ 28 } bg="bg">
      <Box position="fixed" top={ 0 } left={ 0 } right={ 0 } zIndex={ 10 } bg="bg" px={ 5 } py={ 4 }>
        <Container maxW="7xl" mx="auto" px={ 0 }>
          <Header />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={ 5 }>
        <Grid gap={ 6 }>
          <GridItem>
            <Flex align="center" gap={ 2 }>
              <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => navigate('/select')}>
                <Box as={ LuChevronLeft } boxSize={ 6 } />
              </IconButton>
              <Text textStyle="lg" fontWeight="bold">
                이상형 월드컵 ({ roundTitle })
              </Text>
            </Flex>
          </GridItem>

          <GridItem textAlign="center">
            <Text textStyle="md" fontWeight="medium" color="fg.muted">
              마음에 드는 상품을 선택해 주세요 ({ Math.floor(currentIndex / 2) + 1 } / { Math.ceil(matchList.length / 2) })
            </Text>
          </GridItem>

          <GridItem>
            <Grid templateColumns="1fr auto 1fr" gap={{ base: 3, md: 4 }} alignItems="center" position="relative">
              {/* 왼쪽 상품 */}
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
                  mb={ 3 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ leftProduct?.thumbnailUrl || leftProduct?.imageUrl || leftProduct?.image }
                    alt={ leftProduct?.productName || leftProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text textStyle="xs" color="fg.muted" truncate mb={ 1 }>{ leftProduct?.brandName }</Text>
                <Text textStyle={{ base: 'xs', md: 'md' }} fontWeight="bold" textAlign="center" truncate>
                  { leftProduct?.productName || leftProduct?.name }
                </Text>
              </GridItem>

              {/* VS 아이콘 */}
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

              {/* 오른쪽 상품 */}
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
                  mb={ 3 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ rightProduct?.thumbnailUrl || rightProduct?.imageUrl || rightProduct?.image }
                    alt={ rightProduct?.productName || rightProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text textStyle="xs" color="fg.muted" truncate mb={ 1 }>{ rightProduct?.brandName }</Text>
                <Text textStyle={{ base: 'xs', md: 'md' }} fontWeight="bold" textAlign="center" truncate>
                  { rightProduct?.productName || rightProduct?.name }
                </Text>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem textAlign="center" pt={ 2 }>
            <Text textStyle="xs" color="fg.muted">
              상품 정보는 판매처 기준입니다
            </Text>
          </GridItem>
        </Grid>
      </Container>

      <Box position="fixed" bottom={ 0 } left={ 0 } right={ 0 } zIndex={ 10 } bg="bg">
        <TabBar />
      </Box>
    </Box>
  );
}