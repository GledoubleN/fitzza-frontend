import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  HStack,
  Center,
} from '@chakra-ui/react';
import { LuChevronLeft, LuHouse, LuSun, LuMoon } from 'react-icons/lu';

export default function WorldCupPage() {
  const [isDark, setIsDark] = useState(false);

  const toggleColorMode = () => {
    setIsDark(!isDark);
  };

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
    <Center minH="100vh" bg={isDark ? 'gray.900' : 'gray.500'} color={isDark ? 'white' : 'inherit'}>
      <Box
        w="100%"
        maxW="480px"
        minH="100vh"
        display="flex"
        flexDirection="column"
        p={4}
        boxShadow="md"
        position="relative"
        bg={isDark ? 'gray.800' : 'white'}
      >
        <Flex justify="space-between" align="center" mb={3} color={isDark ? 'white' : 'inherit'}>
          <HStack spacing={1} w="80px" justify="flex-start">
            <IconButton variant="ghost" aria-label="뒤로 가기" color={isDark ? 'white' : 'inherit'}>
              <LuChevronLeft size={22} />
            </IconButton>
          </HStack>

          <Text fontSize="lg" fontWeight="bold" textAlign="center" flex="1" color={isDark ? 'white' : 'gray.800'}>
            월드컵
          </Text>

          <HStack spacing={1} w="80px" justify="flex-end">
            <IconButton
              variant="ghost"
              aria-label="테마 전환"
              onClick={toggleColorMode}
              color={isDark ? 'white' : 'inherit'}
            >
              {isDark ? <LuSun size={18} /> : <LuMoon size={18} />}
            </IconButton>
            <IconButton variant="ghost" aria-label="홈으로" color={isDark ? 'white' : 'inherit'}>
              <LuHouse size={20} />
            </IconButton>
          </HStack>
        </Flex>

        <Text textAlign="center" fontSize="sm" color={isDark ? 'gray.400' : 'gray.500'} mb={6}>
          마음에 드는 상품을 선택해 주세요
        </Text>

        <Flex justify="space-between" align="center" position="relative" mb={6}>
          <Box
            w="46%"
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            bg={isDark ? 'gray.700' : '#fdfcfb'}
            borderRadius="16px"
            p={3}
            cursor="pointer"
            boxShadow="sm"
            _hover={{ transform: 'translateY(-2px)' }}
            onClick={() => handleSelect(leftProduct.name)}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" mb={3} bg={isDark ? 'gray.600' : 'gray.100'}>
              <Image
                src={leftProduct.image}
                alt={leftProduct.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center">
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
            w="36px"
            h="36px"
            zIndex="10"
            bg={isDark ? 'gray.600' : 'white'}
            color={isDark ? 'white' : 'gray.900'}
          >
            <Text fontSize="xs" fontWeight="bold">
              VS
            </Text>
          </Center>

          <Box
            w="46%"
            border="1px solid"
            borderColor={isDark ? 'gray.700' : 'gray.200'}
            bg={isDark ? 'gray.700' : '#fdfcfb'}
            borderRadius="16px"
            p={3}
            cursor="pointer"
            boxShadow="sm"
            _hover={{ transform: 'translateY(-2px)' }}
            onClick={() => handleSelect(rightProduct.name)}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" mb={3} bg={isDark ? 'gray.600' : 'gray.100'}>
              <Image
                src={rightProduct.image}
                alt={rightProduct.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center">
              {rightProduct.name}
            </Text>
          </Box>
        </Flex>

        <Box border="1px solid" borderColor={isDark ? 'gray.700' : '#f5ebe6'} bg={isDark ? 'gray.700' : '#fffbf9'} borderRadius="16px" p={3} mb={6} overflowX="auto">
          <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
            <Box as="tbody">
              <Box as="tr">
                <Box as="td" w="37.5%" textAlign="left" fontSize="xs" fontWeight="medium" py={2} pl={2}>
                  <HStack justify="flex-start" spacing={1}>
                    <Box w="10px" h="10px" borderRadius="full" bg={leftProduct.color.hex} border="1px solid rgba(0,0,0,0.1)" />
                    <Text>{leftProduct.color.name}</Text>
                  </HStack>
                </Box>
                <Box as="th" color={isDark ? 'gray.400' : 'gray.500'} fontWeight="medium" w="25%" textAlign="center" py={2} fontSize="xs">색상</Box>
                <Box as="td" w="37.5%" textAlign="right" fontSize="xs" fontWeight="medium" py={2} pr={2}>
                  <HStack justify="flex-end" spacing={1}>
                    <Text>{rightProduct.color.name}</Text>
                    <Box w="10px" h="10px" borderRadius="full" bg={rightProduct.color.hex} border="1px solid rgba(0,0,0,0.1)" />
                  </HStack>
                </Box>
              </Box>

              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.size}</Box>
                <Box as="th" color={isDark ? 'gray.400' : 'gray.500'} fontWeight="medium" textAlign="center" py={2} fontSize="xs">사이즈</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.size}</Box>
              </Box>

              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.material}</Box>
                <Box as="th" color={isDark ? 'gray.400' : 'gray.500'} fontWeight="medium" textAlign="center" py={2} fontSize="xs">소재</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.material}</Box>
              </Box>

              <Box as="tr">
                <Box as="td" textAlign="left" fontSize="xs" fontWeight="medium" py={2} pl={2}>{leftProduct.tpo}</Box>
                <Box as="th" color={isDark ? 'gray.400' : 'gray.500'} fontWeight="medium" textAlign="center" py={2} fontSize="xs">TPO</Box>
                <Box as="td" textAlign="right" fontSize="xs" fontWeight="medium" py={2} pr={2}>{rightProduct.tpo}</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box mt="auto" pb={2} textAlign="center">
          <Text fontSize="11px" color={isDark ? 'gray.500' : 'gray.400'}>
            상품 정보는 판매처 기준입니다
          </Text>
        </Box>
      </Box>
    </Center>
  );
}