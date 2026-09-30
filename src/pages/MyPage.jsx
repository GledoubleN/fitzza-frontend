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
    <Box position="relative" minH="100vh" pb={28} bg="bg">
      <Container
        maxW="container.xl"
        mx="auto"
        py={10}
        px={5}
      >
        <Box mb={6}>
          <AppBar />
        </Box>

        <Flex
          align="center"
          justify="space-between"
          mb={8}
          pb={4}
          borderBottomWidth="thin"
          borderColor="border.subtle"
          bg="bg.panel"
          p={5}
          borderRadius="2xl"
        >
          <Heading textStyle="lg" fontWeight="700">
            마이페이지
          </Heading>
          <Button variant="outline" size="md">
            고객센터
          </Button>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', lg: '88 1fr' }}
          gap={8}
          alignItems="start"
        >
          <Flex direction="column" gap={6}>

            <Card.Root borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={6} bg="bg.panel">
              <Card.Body p={0}>
                <Flex direction="column" align="center" pt={1} pb={1}>
                  <Box
                    boxSize="22"
                    borderWidth="thin"
                    borderColor="border.subtle"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="4xl"
                    bg="bg.muted"
                    mb={3}
                  >
                    👤
                  </Box>
                  <Heading textStyle="md" mt={1} fontWeight="600">
                    사용자
                  </Heading>
                  <Text textStyle="sm" mt={1} color="fg.muted">
                    @fit_user
                  </Text>
                </Flex>

                <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={5}>
                  <Box
                    p={4}
                    borderWidth="thin"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    bg="bg.muted"
                    textAlign="center"
                  >
                    <Text textStyle="xs" color="fg.muted" mb={1}>적립금</Text>
                    <Text textStyle="sm" fontWeight="600">7,777원</Text>
                  </Box>

                  <Box
                    p={4}
                    borderWidth="thin"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    bg="bg.muted"
                    textAlign="center"
                  >
                    <Text textStyle="xs" color="fg.muted" mb={1}>쿠폰</Text>
                    <Text textStyle="sm" fontWeight="600">11장</Text>
                  </Box>
                </Grid>
              </Card.Body>
            </Card.Root>

            <Card.Root borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={4} bg="bg.panel">
              <Card.Body p={0}>
                <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                  {[
                    { label: '주문', icon: '📦' },
                    { label: 'TMI/이벤트', icon: '🎉' },
                    { label: '커뮤니티', icon: '💬' },
                    { label: '설정', icon: '⚙️' },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      borderWidth="thin"
                      borderColor="border.subtle"
                      borderRadius="xl"
                      height="auto"
                      py={3}
                      px={1}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      bg="bg.muted"
                      _hover={{ bg: 'bg.subtle', borderColor: 'fg.muted' }}
                    >
                      <Text fontSize="lg" mb={1}>{item.icon}</Text>
                      <Text textStyle="xs" fontWeight="600" color="fg">{item.label}</Text>
                    </Button>
                  ))}
                </Grid>
              </Card.Body>
            </Card.Root>

          </Flex>

          <Card.Root borderWidth="thin" borderColor="border.subtle" borderRadius="2xl" p={6} bg="bg.panel">
            <Card.Body p={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading textStyle="md" fontWeight="700">
                  나의 스냅
                </Heading>
                <Button variant="ghost" size="sm" color="fg.muted">
                  전체보기 &gt;
                </Button>
              </Flex>

              <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
                gap={3}
              >
                {['1', '2', '3', '4'].map((num) => (
                  <Card.Root key={num} overflow="hidden" borderRadius="xl" variant="outline" borderColor="border.subtle">
                    <Card.Body p={0} aspectRatio="1 / 1" bg="bg.muted" display="flex" alignItems="center" justifyContent="center">
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