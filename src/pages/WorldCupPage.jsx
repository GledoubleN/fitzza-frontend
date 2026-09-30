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
} from '@chakra-ui/react';
import { LuChevronLeft, LuHouse, LuRotateCcw, LuShare2 } from 'react-icons/lu';
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

  const handleGoHome = () => {
    console.log('홈으로 이동');
  };

  if (isFinished && winnerProduct) {
    return (
      <Box position="relative" minH="100vh" pb={28} bg="bg">
        <Container maxW="container.xl" mx="auto" py={10} px={5}>
          {/* 상단 앱바 */}
          <Box mb={6}>
            <AppBar />
          </Box>

          <Center w="100%">
            <Box
              w="100%"
              maxW="md"
              display="flex"
              flexDirection="column"
              p={4}
              boxShadow="md"
              borderRadius="2xl"
              bg="bg.panel"
              borderWidth="thin"
              borderColor="border.subtle"
              position="relative"
            >
              <Flex justify="space-between" align="center" mb={3}>
                <HStack gap={1} w={20} justify="flex-start">
                  <IconButton variant="ghost" aria-label="뒤로 가기" onClick={handleRestart}>
                    <Box as={LuChevronLeft} boxSize={6} />
                  </IconButton>
                </HStack>

                <Text textStyle="lg" fontWeight="bold" textAlign="center" flex="1">
                  이상형 월드컵 결과
                </Text>

                <HStack gap={1} w={20} justify="flex-end">
                  <IconButton variant="ghost" aria-label="홈으로" onClick={handleGoHome}>
                    <Box as={LuHouse} boxSize={5} />
                  </IconButton>
                </HStack>
              </Flex>

              <Text textAlign="center" textStyle="md" fontWeight="bold" mb={4} color="purple.500">
                🎉 당신의 최종 선택은? 🎉
              </Text>

              <Box
                w="100%"
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="xl"
                p={4}
                boxShadow="sm"
                mb={6}
                textAlign="center"
              >
                <Box w="100%" h="60" borderRadius="lg" overflow="hidden" mb={4}>
                  <Image
                    src={winnerProduct.image}
                    alt={winnerProduct.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text textStyle="lg" fontWeight="bold" mb={2}>
                  {winnerProduct.name}
                </Text>
              </Box>

              <Box borderWidth="thin" borderColor="border.subtle" borderRadius="xl" p={3} mb={6}>
                <Text textStyle="xs" fontWeight="bold" mb={3} textAlign="center" color="fg.muted">
                  우승 상품 스펙 요약
                </Text>
                <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                  <Box as="tbody">
                    <Box as="tr">
                      <Box as="th" fontWeight="medium" w="30%" textAlign="left" py={2} pl={2} textStyle="xs">색상</Box>
                      <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>
                        <HStack justify="flex-end" gap={1}>
                          <Box boxSize={2.5} borderRadius="full" bg={winnerProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                          <Text>{winnerProduct.color.name}</Text>
                        </HStack>
                      </Box>
                    </Box>
                    <Box as="tr">
                      <Box as="th" fontWeight="medium" textAlign="left" py={2} pl={2} textStyle="xs">사이즈</Box>
                      <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{winnerProduct.size}</Box>
                    </Box>
                    <Box as="tr">
                      <Box as="th" fontWeight="medium" textAlign="left" py={2} pl={2} textStyle="xs">소재</Box>
                      <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{winnerProduct.material}</Box>
                    </Box>
                    <Box as="tr">
                      <Box as="th" fontWeight="medium" textAlign="left" py={2} pl={2} textStyle="xs">TPO</Box>
                      <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{winnerProduct.tpo}</Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <HStack gap={3} mb={4}>
                <Button
                  flex="1"
                  variant="outline"
                  borderRadius="xl"
                  onClick={handleRestart}
                >
                  <Box as={LuRotateCcw} boxSize={4} mr={1} />
                  다시 하기
                </Button>
                <Button
                  flex="1"
                  bg="black"
                  color="white"
                  borderRadius="xl"
                  _hover={{ bg: 'gray.800' }}
                >
                  <Box as={LuShare2} boxSize={4} mr={1} />
                  결과 공유
                </Button>
              </HStack>

              <Box pb={2} textAlign="center">
                <Text textStyle="2xs" color="fg.muted">
                  상품 정보는 판매처 기준입니다
                </Text>
              </Box>
            </Box>
          </Center>
        </Container>

        <TabBar />
      </Box>
    );
  }

  return (
    <Box position="relative" minH="100vh" pb={28} bg="bg">
      <Container maxW="container.xl" mx="auto" py={10} px={5}>
        <Box mb={6}>
          <AppBar />
        </Box>

        <Center w="100%">
          <Box
            w="100%"
            maxW="md"
            display="flex"
            flexDirection="column"
            p={4}
            boxShadow="md"
            borderRadius="2xl"
            bg="bg.panel"
            borderWidth="thin"
            borderColor="border.subtle"
            position="relative"
          >
            <Flex justify="space-between" align="center" mb={3}>
              <HStack gap={1} w={20} justify="flex-start">
                <IconButton variant="ghost" aria-label="뒤로 가기" onClick={handleGoHome}>
                  <Box as={LuChevronLeft} boxSize={6} />
                </IconButton>
              </HStack>

              <Text textStyle="lg" fontWeight="bold" textAlign="center" flex="1">
                월드컵
              </Text>

              <HStack gap={1} w={20} justify="flex-end">
                <IconButton variant="ghost" aria-label="홈으로" onClick={handleGoHome}>
                  <Box as={LuHouse} boxSize={5} />
                </IconButton>
              </HStack>
            </Flex>

            <Text textAlign="center" textStyle="sm" mb={4}>
              마음에 드는 상품을 선택해 주세요
            </Text>

            <Flex justify="space-between" align="center" position="relative" mb={6}>
              <Box
                w="46%"
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="xl"
                p={3}
                cursor="pointer"
                boxShadow="sm"
                _hover={{ transform: 'translateY(-2px)' }}
                onClick={() => handleSelect(leftProduct)}
              >
                <Box w="100%" h="40" borderRadius="lg" overflow="hidden" mb={3}>
                  <Image
                    src={leftProduct.image}
                    alt={leftProduct.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text textStyle="sm" fontWeight="bold" textAlign="center">
                  {leftProduct.name}
                </Text>
              </Box>

              <Center
                position="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%, -50%)"
                boxShadow="md"
                borderRadius="full"
                boxSize={9}
                zIndex="10"
                bg="bg.panel"
                borderWidth="thin"
                borderColor="border.subtle"
              >
                <Text textStyle="xs" fontWeight="bold">
                  VS
                </Text>
              </Center>

              <Box
                w="46%"
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="xl"
                p={3}
                cursor="pointer"
                boxShadow="sm"
                _hover={{ transform: 'translateY(-2px)' }}
                onClick={() => handleSelect(rightProduct)}
              >
                <Box w="100%" h="40" borderRadius="lg" overflow="hidden" mb={3}>
                  <Image
                    src={rightProduct.image}
                    alt={rightProduct.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text textStyle="sm" fontWeight="bold" textAlign="center">
                  {rightProduct.name}
                </Text>
              </Box>
            </Flex>

            <Box borderWidth="thin" borderColor="border.subtle" borderRadius="xl" p={3} mb={6} overflowX="auto">
              <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                <Box as="tbody">
                  <Box as="tr">
                    <Box as="td" w="37.5%" textAlign="left" textStyle="xs" fontWeight="medium" py={2} pl={2}>
                      <HStack justify="flex-start" gap={1}>
                        <Box boxSize={2.5} borderRadius="full" bg={leftProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                        <Text>{leftProduct.color.name}</Text>
                      </HStack>
                    </Box>
                    <Box as="th" fontWeight="medium" w="25%" textAlign="center" py={2} textStyle="xs">색상</Box>
                    <Box as="td" w="37.5%" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>
                      <HStack justify="flex-end" gap={1}>
                        <Text>{rightProduct.color.name}</Text>
                        <Box boxSize={2.5} borderRadius="full" bg={rightProduct.color.hex} borderWidth="thin" borderColor="border.subtle" />
                      </HStack>
                    </Box>
                  </Box>

                  <Box as="tr">
                    <Box as="td" textAlign="left" textStyle="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.size}</Box>
                    <Box as="th" fontWeight="medium" textAlign="center" py={2} textStyle="xs">사이즈</Box>
                    <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.size}</Box>
                  </Box>

                  <Box as="tr">
                    <Box as="td" textAlign="left" textStyle="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.material}</Box>
                    <Box as="th" fontWeight="medium" textAlign="center" py={2} textStyle="xs">소재</Box>
                    <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.material}</Box>
                  </Box>

                  <Box as="tr">
                    <Box as="td" textAlign="left" textStyle="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.tpo}</Box>
                    <Box as="th" fontWeight="medium" textAlign="center" py={2} textStyle="xs">TPO</Box>
                    <Box as="td" textAlign="right" textStyle="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.tpo}</Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box pb={2} textAlign="center">
              <Text textStyle="2xs" color="fg.muted">
                상품 정보는 판매처 기준입니다
              </Text>
            </Box>
          </Box>
        </Center>
      </Container>

      <TabBar />
    </Box>
  );
}