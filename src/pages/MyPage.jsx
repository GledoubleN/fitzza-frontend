import {
  Container,
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Grid,
  Card
} from '@chakra-ui/react';
import { AppBar } from '../components/AppBar.jsx';
import { TabBar } from '../components/TabBar.jsx';

export default function MyPage() {
  return (
    <Box position="relative" minH="100vh" pb="120px" bg="bg">
      <Container
        maxW="1200px"
        mx="auto"
        py="40px"
        px="20px"
      >
        <Box mb="24px">
          <AppBar />
        </Box>

        <Flex
          align="center"
          justify="space-between"
          mb="32px"
          pb="16px"
          borderBottom="1px solid"
          borderColor="border.subtle"
          bg="bg.panel"
          p="20px"
          borderRadius="16px"
        >
          <Heading textStyle="lg" fontWeight="700">
            마이페이지
          </Heading>
          <Button variant="outline" size="md">
            고객센터
          </Button>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', lg: '350px 1fr' }}
          gap="32px"
          alignItems="start"
        >
          <Flex direction="column" gap="24px">

            <Card.Root borderWidth="1px" borderColor="border.subtle" borderRadius="16px" p="24px" bg="bg.panel">
              <Card.Body p="0">
                <Flex direction="column" align="center" pt="4px" pb="4px">
                  <Box
                    width="90px"
                    height="90px"
                    border="1px solid"
                    borderColor="border.subtle"
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="42px"
                    bg="bg.muted"
                    mb="12px"
                  >
                    👤
                  </Box>
                  <Heading textStyle="md" mt="4px" fontWeight="600">
                    사용자
                  </Heading>
                  <Text textStyle="sm" mt="4px" color="fg.muted">
                    @fit_user
                  </Text>
                </Flex>

                <Box
                  mt="20px"
                  px="10px"
                  py="16px"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="12px"
                  bg="bg.muted"
                >
                  <Flex align="center">
                    <Box flex="1" px="12px" textAlign="center">
                      <Text textStyle="xs" color="fg.muted" mb="4px">적립금</Text>
                      <Text textStyle="sm" fontWeight="600">7,777원</Text>
                    </Box>
                    <Box width="1px" height="30px" bg="border.subtle" />
                    <Box flex="1" px="12px" textAlign="center">
                      <Text textStyle="xs" color="fg.muted" mb="4px">쿠폰</Text>
                      <Text textStyle="sm" fontWeight="600">11장</Text>
                    </Box>
                  </Flex>
                </Box>
              </Card.Body>
            </Card.Root>

            <Card.Root borderWidth="1px" borderColor="border.subtle" borderRadius="16px" p="16px" bg="bg.panel">
              <Card.Body p="0">
                <Flex justify="space-around">
                  <Button variant="ghost" height="auto" p="8px">
                    <Text textStyle="xs">주문</Text>
                  </Button>
                  <Button variant="ghost" height="auto" p="8px">
                    <Text textStyle="xs">TMI/이벤트</Text>
                  </Button>
                  <Button variant="ghost" height="auto" p="8px">
                    <Text textStyle="xs">커뮤니티</Text>
                  </Button>
                  <Button variant="ghost" height="auto" p="8px">
                    <Text textStyle="xs">설정</Text>
                  </Button>
                </Flex>
              </Card.Body>
            </Card.Root>

          </Flex>

          <Card.Root borderWidth="1px" borderColor="border.subtle" borderRadius="16px" p="24px" bg="bg.panel">
            <Card.Body p="0">
              <Flex justify="space-between" align="center" mb="16px">
                <Heading textStyle="md" fontWeight="700">
                  나의 스냅
                </Heading>
                <Button variant="ghost" size="sm" color="fg.muted">
                  전체보기 &gt;
                </Button>
              </Flex>

              <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
                gap="12px"
              >
                {['1', '2', '3', '4'].map((num) => (
                  <Card.Root key={num} overflow="hidden" borderRadius="12px" variant="outline" borderColor="border.subtle">
                    <Card.Body p="0" aspectRatio="1 / 1" bg="bg.muted" display="flex" alignItems="center" justifyContent="center">
                      <Text textStyle="xs" color="fg.muted">스냅 {num}</Text>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Grid>
            </Card.Body>
          </Card.Root>

        </Grid>
      </Container>

      <TabBar />
    </Box>
  );
}