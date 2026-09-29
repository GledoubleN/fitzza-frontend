import {
  Container,
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Grid
} from '@chakra-ui/react';
import { AppBar } from '../components/AppBar.jsx'; // 👈 메인페이지와 똑같은 상단바 임포트
import { TabBar } from '../components/TabBar.jsx';

export default function MyPage() {
  return (
    <Box position="relative" minH="100vh" pb="120px" bg="gray.50">
      <Container
        maxW="1200px"
        mx="auto"
        py="40px"
        px="20px"
      >
        {/* 메인페이지와 동일한 상단바(AppBar) 배치 */}
        <Box mb="24px">
          <AppBar />
        </Box>

        {/* 마이페이지 타이틀 영역 */}
        <Flex
          align="center"
          justify="space-between"
          mb="32px"
          pb="16px"
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="white"
          p="20px"
          borderRadius="16px"
        >
          <Heading size="lg" fontWeight="700">
            마이페이지
          </Heading>
          <Button variant="outline" size="md">
            고객센터
          </Button>
        </Flex>

        {/* PC 전용 2단 레이아웃 */}
        <Grid
          templateColumns={{ base: '1fr', lg: '350px 1fr' }}
          gap="32px"
          alignItems="start"
        >
          <Flex direction="column" gap="24px">

            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="16px"
              p="24px"
              bg="white"
            >
              <Flex direction="column" align="center" pt="4px" pb="4px">
                <Box
                  width="90px"
                  height="90px"
                  border="1px solid"
                  borderColor="#e5e5e5"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="42px"
                  bg="#f7f7f7"
                  mb="12px"
                >
                  👤
                </Box>
                <Heading size="md" mt="4px" fontWeight="600">
                  사용자
                </Heading>
                <Text mt="4px" fontSize="14px" color="gray.500">
                  @fit_user
                </Text>
              </Flex>

              <Box
                mt="20px"
                px="10px"
                py="16px"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="12px"
                bg="gray.50"
              >
                <Flex align="center">
                  <Box flex="1" px="12px" textAlign="center">
                    <Text fontSize="13px" color="gray.500" mb="4px">적립금</Text>
                    <Text fontSize="16px" fontWeight="600">7,777원</Text>
                  </Box>
                  <Box width="1px" height="30px" bg="gray.200" />
                  <Box flex="1" px="12px" textAlign="center">
                    <Text fontSize="13px" color="gray.500" mb="4px">쿠폰</Text>
                    <Text fontSize="16px" fontWeight="600">11장</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="16px"
              p="16px"
              bg="white"
            >
              <Flex justify="space-around">
                <Button variant="ghost" height="auto" p="8px">
                  <Text fontSize="13px">주문</Text>
                </Button>
                <Button variant="ghost" height="auto" p="8px">
                  <Text fontSize="13px">TMI/이벤트</Text>
                </Button>
                <Button variant="ghost" height="auto" p="8px">
                  <Text fontSize="13px">커뮤니티</Text>
                </Button>
                <Button variant="ghost" height="auto" p="8px">
                  <Text fontSize="13px">설정</Text>
                </Button>
              </Flex>
            </Box>

          </Flex>

          <Box
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="16px"
            p="24px"
            bg="white"
          >
            <Flex justify="space-between" align="center" mb="16px">
              <Heading size="md" fontWeight="700">
                나의 스냅
              </Heading>
              <Button variant="ghost" size="sm" color="gray.500">
                전체보기 &gt;
              </Button>
            </Flex>

            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
              gap="12px"
            >
              {['1', '2', '3', '4'].map((num) => (
                <Box
                  key={num}
                  width="100%"
                  aspectRatio="1 / 1"
                  bg="gray.100"
                  borderRadius="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="gray.400">스냅 {num}</Text>
                </Box>
              ))}
            </Grid>
          </Box>

        </Grid>
      </Container>

      <TabBar />
    </Box>
  );
}