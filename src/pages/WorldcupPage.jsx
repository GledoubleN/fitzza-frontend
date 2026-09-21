import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Center,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

export default function WorldCupPage() {
  const handleSelect = (productName) => {
    alert(`'${productName}'을(를) 선택하셨습니다! 다음 라운드로 이동합니다.`);
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
            icon={<ChevronLeftIcon boxSize={6} />}
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

        <Flex justify="space-between" align="center" position="relative" mb={6}>
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
            onClick={() => handleSelect('코튼 워크 재킷')}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" bg="gray.100" mb={3}>
              <Image
                src="https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60"
                alt="코튼 워크 재킷"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center" color="gray.800">
              코튼 워크 재킷
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
            onClick={() => handleSelect('울 블렌드 재킷')}
          >
            <Box w="100%" h="160px" borderRadius="12px" overflow="hidden" bg="gray.100" mb={3}>
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60"
                alt="울 블렌드 재킷"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="bold" textAlign="center" color="gray.800">
              울 블렌드 재킷
            </Text>
          </Box>
        </Flex>

        <Box bg="#fffbf9" border="1px solid" borderColor="#f5ebe6" borderRadius="16px" p={3} mb={6}>
          <Table variant="unstyled" size="sm">
            <Tbody>
              <Tr>
                <Th color="gray.500" fontWeight="medium" w="25%" textAlign="center">색상</Th>
                <Td w="37.5%" textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">
                  <HStack justify="center" spacing={1}>
                    <Box w="10px" h="10px" borderRadius="full" bg="#8c7b6d" border="1px solid rgba(0,0,0,0.1)" />
                    <Text>카키</Text>
                  </HStack>
                </Td>
                <Td w="37.5%" textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">
                  <HStack justify="center" spacing={1}>
                    <Box w="10px" h="10px" borderRadius="full" bg="#d9cbd1" border="1px solid rgba(0,0,0,0.1)" />
                    <Text>베이지</Text>
                  </HStack>
                </Td>
              </Tr>
              <Tr>
                <Th color="gray.500" fontWeight="medium" textAlign="center">사이즈</Th>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">S · M · L</Td>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">1 · 2</Td>
              </Tr>
              <Tr>
                <Th color="gray.500" fontWeight="medium" textAlign="center">소재</Th>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">코튼 100%</Td>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">울 · 폴리에스터</Td>
              </Tr>
              <Tr>
                <Th color="gray.500" fontWeight="medium" textAlign="center">TPO</Th>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">캐주얼</Td>
                <Td textAlign="center" fontSize="xs" fontWeight="medium" color="gray.700">캐주얼 · 포멀</Td>
              </Tr>
            </Tbody>
          </Table>
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