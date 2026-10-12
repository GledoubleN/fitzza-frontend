import React, { useState } from 'react';
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
import { AppBar } from '../components/AppBar.jsx';
import { TabBar } from '../components/TabBar.jsx';

export default function WorldCupPage() {
  const [isFinished, setIsFinished] = useState(false);
  const [winnerProduct, setWinnerProduct] = useState(null);

  const leftProduct = {
    name: '코튼 워크 재킷',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop',
    color: { name: '카키', hex: '#8c7b6d' },
    size: 'S · M · L',
    material: '코튼 100%',
    tpo: '캐주얼',
  };

  const rightProduct = {
    name: '울 블렌드 재킷',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop',
    color: { name: '베이지', hex: '#d9cbd1' },
    size: '1 · 2',
    material: '울 · 폴리에스터',
    tpo: '캐주얼 · 포멀',
  };

  const handleSelect = (product) => {
    setWinnerProduct(product);
    setIsFinished(true);
  };

  const handleRestart = () => {
    setIsFinished(false);
    setWinnerProduct(null);
  };

  if (isFinished && winnerProduct) {
    return (
      <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
        <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
          <Container maxW="7xl" mx="auto" px={0}>
            <AppBar />
          </Container>
        </Box>

        <Container maxW="3xl" mx="auto" px={5}>
          <Grid gap={6}>
            <GridItem>
              <Flex align="center" gap={2}>
                <IconButton variant="ghost" aria-label="뒤로 가기" onClick={handleRestart}>
                  <Box as={LuChevronLeft} boxSize={6} />
                </IconButton>
                <Text textStyle="lg" fontWeight="bold">
                  이상형 월드컵 결과
                </Text>
              </Flex>
            </GridItem>

            <GridItem textAlign="center">
              <Text textStyle="md" fontWeight="bold" color="purple.500">
                🎉 당신의 최종 선택은? 🎉
              </Text>
            </GridItem>

            <GridItem textAlign="center">
              <Box w="100%" h={{ base: "sm", md: "md" }} borderRadius="2xl" overflow="hidden" mb={4} borderWidth="thin" borderColor="border.subtle">
                <Image
                  src={winnerProduct.image}
                  alt={winnerProduct.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>
              <Text textStyle="xl" fontWeight="bold">
                {winnerProduct.name}
              </Text>
            </GridItem>

            <GridItem borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={5} bg="bg.panel">
              <Text textStyle="sm" fontWeight="bold" mb={4} textAlign="center" color="fg.muted">
                우승 상품 스펙 요약
              </Text>
              <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                <Box as="tbody">
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" w="30%" textAlign="left" py={2.5} pl={2} textStyle="sm">색상</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>
                      <HStack justify="flex-end" gap={1.5}>
                        <Box boxSize={3} borderRadius="full" bg={winnerProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                        <Text>{winnerProduct.color.name}</Text>
                      </HStack>
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" textAlign="left" py={2.5} pl={2} textStyle="sm">사이즈</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>{winnerProduct.size}</Box>
                  </Box>
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" textAlign="left" py={2.5} pl={2} textStyle="sm">소재</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>{winnerProduct.material}</Box>
                  </Box>
                  <Box as="tr">
                    <Box as="th" fontWeight="medium" textAlign="left" py={2.5} pl={2} textStyle="sm">TPO</Box>
                    <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={2.5} pr={2}>{winnerProduct.tpo}</Box>
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
                >
                  <Box as={LuShare2} boxSize={4} mr={2} />
                  결과 공유
                </Button>
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

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5}>
        <Grid gap={6}>
          <GridItem>
            <Flex align="center" gap={2}>
              <IconButton variant="ghost" aria-label="뒤로 가기" onClick={() => window.history.back()}>
                <Box as={LuChevronLeft} boxSize={6} />
              </IconButton>
              <Text textStyle="lg" fontWeight="bold">
                월드컵
              </Text>
            </Flex>
          </GridItem>

          <GridItem textAlign="center">
            <Text textStyle="md" fontWeight="medium">
              마음에 드는 상품을 선택해 주세요
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
                _hover={{ borderColor: 'fg.muted', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => handleSelect(leftProduct)}
              >
                <Box w="100%" h={{ base: "40", md: "60" }} borderRadius="xl" overflow="hidden" mb={3}>
                  <Image
                    src={leftProduct.image}
                    alt={leftProduct.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text textStyle={{ base: "xs", md: "md" }} fontWeight="bold" textAlign="center" truncate>
                  {leftProduct.name}
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
                  <Text textStyle={{ base: "xs", md: "sm" }} fontWeight="bold">
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
                _hover={{ borderColor: 'fg.muted', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => handleSelect(rightProduct)}
              >
                <Box w="100%" h={{ base: "40", md: "60" }} borderRadius="xl" overflow="hidden" mb={3}>
                  <Image
                    src={rightProduct.image}
                    alt={rightProduct.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text textStyle={{ base: "xs", md: "md" }} fontWeight="bold" textAlign="center" truncate>
                  {rightProduct.name}
                </Text>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={5} bg="bg.panel" overflowX="auto">
            <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
              <Box as="tbody">
                <Box as="tr">
                  <Box as="td" w="37.5%" textAlign="left" textStyle="sm" fontWeight="medium" py={3} pl={2}>
                    <HStack justify="flex-start" gap={1.5}>
                      <Box boxSize={3} borderRadius="full" bg={leftProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                      <Text>{leftProduct.color.name}</Text>
                    </HStack>
                  </Box>
                  <Box as="th" fontWeight="bold" w="25%" textAlign="center" py={3} textStyle="sm">색상</Box>
                  <Box as="td" w="37.5%" textAlign="right" textStyle="sm" fontWeight="medium" py={3} pr={2}>
                    <HStack justify="flex-end" gap={1.5}>
                      <Text>{rightProduct.color.name}</Text>
                      <Box boxSize={3} borderRadius="full" bg={rightProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                    </HStack>
                  </Box>
                </Box>

                <Box as="tr">
                  <Box as="td" textAlign="left" textStyle="sm" fontWeight="medium" py={3} pl={2}>{leftProduct.size}</Box>
                  <Box as="th" fontWeight="bold" textAlign="center" py={3} textStyle="sm">사이즈</Box>
                  <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={3} pr={2}>{rightProduct.size}</Box>
                </Box>

                <Box as="tr">
                  <Box as="td" textAlign="left" textStyle="sm" fontWeight="medium" py={3} pl={2}>{leftProduct.material}</Box>
                  <Box as="th" fontWeight="bold" textAlign="center" py={3} textStyle="sm">소재</Box>
                  <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={3} pr={2}>{rightProduct.material}</Box>
                </Box>

                <Box as="tr">
                  <Box as="td" textAlign="left" textStyle="sm" fontWeight="medium" py={3} pl={2}>{leftProduct.tpo}</Box>
                  <Box as="th" fontWeight="bold" textAlign="center" py={3} textStyle="sm">TPO</Box>
                  <Box as="td" textAlign="right" textStyle="sm" fontWeight="medium" py={3} pr={2}>{rightProduct.tpo}</Box>
                </Box>
              </Box>
            </Box>
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