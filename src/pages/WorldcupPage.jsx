import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  HStack,
  Center,
} from '@chakra-ui/react';

export default function WorldCupPage() {
  const leftProduct = {
    name: '코튼 워크 재킷',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60',
    color: { name: '카키', hex: '#8c7b6d' },
    size: 'S · M · L',
    material: '코튼 100%',
    tpo: '캐주얼',
  };

  const rightProduct = {
    name: '울 블렌드 재킷',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
    color: { name: '베이지', hex: '#d9cbd1' },
    size: '1 · 2',
    material: '울 · 폴리에스터',
    tpo: '캐주얼 · 포멀',
  };

  const handleSelect = (productName) => {
    console.log(`선택된 상품: ${productName}`);
  };

  return (
    <Center bg="gray.100" minH="100vh">
      <Box
        w="100%"
        maxW="480px"
        bg="white"
        minH="100vh"
        display="flex"
        flexDirection="column"
        p={4}
        boxShadow="md"
        position="relative"
      >
        <Flex justify="space-between" align="center" mb={3}>
          <IconButton
            icon={<Text fontSize="xl">‹</Text>}
            variant="ghost"
            aria-label="뒤로 가기"
          />
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            월드컵
          </Text>
          <IconButton
            icon={<Text fontSize="lg">🏠</Text>}
            variant="ghost"
            aria-label="홈으로"
          />
        </Flex>

        <Text textAlign="center" fontSize="sm" color="gray.500" mb={6}>
          마음에 드는 상품을 선택해 주세요
        </Text>

        {/* ⚔️ VS 배틀 카드 섹션 */}
        <Flex justify="space-between" align="center" position="relative" mb={6}>
          {/* 왼쪽 상품 */}
          <Box
            w="46%"
            bg="#fdfcfb"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="16px"
            p={3}
            cursor="pointer"
            boxShadow="sm"
            _hover={{ borderColor: 'gray.400', transform: 'translateY(-2px)' }}
            onClick={() => handleSelect(leftProduct.name)}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" bg="gray.100" mb={3}>
              <Image
                src={leftProduct.image}
                alt={leftProduct.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center" color="gray.800">
              {leftProduct.name}
            </Text>
          </Box>

          <Center
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            boxShadow="md"
            borderRadius="full"
            w="36px"
            h="36px"
            zIndex="10"
          >
            <Text fontSize="xs" fontWeight="bold" color="gray.900">
              VS
            </Text>
          </Center>

          {/* 오른쪽 상품 */}
          <Box
            w="46%"
            bg="#fdfcfb"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="16px"
            p={3}
            cursor="pointer"
            boxShadow="sm"
            _hover={{ borderColor: 'gray.400', transform: 'translateY(-2px)' }}
            onClick={() => handleSelect(rightProduct.name)}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" bg="gray.100" mb={3}>
              <Image
                src={rightProduct.image}
                alt={rightProduct.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center" color="gray.800">
              {rightProduct.name}
            </Text>
          </Box>
        </Flex>

        {/* 📊 스펙 비교 테이블 섹션 (라벨 중앙, 데이터 양쪽 분할) */}
        <Box bg="#fffbf9" border="1px solid" borderColor="#f5ebe6" borderRadius="16px" p={3} mb={6} overflowX="auto">
          <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
            <Box as="tbody">
              {/* 색상 */}
              <Box as="tr">
                <Box as="td" w="37.5%" textAlign="left" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pl={2}>
                  <HStack justify="flex-start" spacing={1}>
                    <Box w="10px" h="10px" borderRadius="full" bg={leftProduct.color.hex} border="1px solid rgba(0,0,0,0.1)" />
                    <Text>{leftProduct.color.name}</Text>
                  </HStack>
                </Box>
                <Box as="th" color="gray.500" fontWeight="medium" w="25%" textAlign="center" py={2} fontSize="xs">색상</Box>
                <Box as="td" w="37.5%" textAlign="right" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pr={2}>
                  <HStack justify="flex-end" spacing={1}>
                    <Text>{rightProduct.color.name}</Text>
                    <Box w="10px" h="10px" borderRadius="full" bg={rightProduct.color.hex} border="1px solid rgba(0,0,0,0.1)" />
                  </HStack>
                </Box>
              </Box>

              {/* 사이즈 */}
              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pl={2}>{leftProduct.size}</Box>
                <Box as="th" color="gray.500" fontWeight="medium" textAlign="center" py={2} fontSize="xs">사이즈</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pr={2}>{rightProduct.size}</Box>
              </Box>

              {/* 소재 */}
              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pl={2}>{leftProduct.material}</Box>
                <Box as="th" color="gray.500" fontWeight="medium" textAlign="center" py={2} fontSize="xs">소재</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pr={2}>{rightProduct.material}</Box>
              </Box>

              {/* TPO */}
              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pl={2}>{leftProduct.tpo}</Box>
                <Box as="th" color="gray.500" fontWeight="medium" textAlign="center" py={2} fontSize="xs">TPO</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" color="gray.700" py={2} pr={2}>{rightProduct.tpo}</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box mt="auto" pb={2} textAlign="center">
          <Text fontSize="11px" color="gray.400">
            상품 정보는 판매처 기준입니다
          </Text>
        </Box>
      </Box>
    </Center>
  );
}