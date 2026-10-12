import {
  Container,
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Grid,
} from '@chakra-ui/react';
import { AppBar } from '../components/AppBar.jsx';
import { TabBar } from '../components/TabBar.jsx';

export default function ProfilePage() {
  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="5xl" mx="auto" px={5}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1.8fr' }}
          gap={6}
          alignItems="stretch"
        >
          <Flex direction="column" justify="space-between" gap={6} h="100%">
            <Box
              borderWidth="thin"
              borderColor="border.subtle"
              borderRadius="2xl"
              p={8}
              bg="bg.panel"
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Flex direction="column" align="center" pt={2} pb={2}>
                <Box
                  boxSize={24}
                  borderWidth="thin"
                  borderColor="border.subtle"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="5xl"
                  bg="bg.muted"
                  mb={4}
                >
                  👤
                </Box>
                <Heading textStyle="lg" mt={1} fontWeight="600">
                  사용자
                </Heading>
                <Text textStyle="sm" mt={1} color="fg.muted">
                  @fit_user
                </Text>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6}>
                <Box
                  p={5}
                  borderWidth="thin"
                  borderColor="border.subtle"
                  borderRadius="xl"
                  bg="bg.muted"
                  textAlign="center"
                >
                  <Text textStyle="xs" color="fg.muted" mb={1}>적립금</Text>
                  <Text textStyle="md" fontWeight="600">7,777원</Text>
                </Box>

                <Box
                  p={5}
                  borderWidth="thin"
                  borderColor="border.subtle"
                  borderRadius="xl"
                  bg="bg.muted"
                  textAlign="center"
                >
                  <Text textStyle="xs" color="fg.muted" mb={1}>쿠폰</Text>
                  <Text textStyle="md" fontWeight="600">11장</Text>
                </Box>
              </Grid>
            </Box>

            <Box
              borderWidth="thin"
              borderColor="border.subtle"
              borderRadius="2xl"
              p={5}
              bg="bg.panel"
            >
              <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                {[
                  { label: '주문', icon: '📦' },
                  { label: '이벤트', icon: '🎉' },
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
                    py={4}
                    px={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="bg.muted"
                    _hover={{ bg: 'bg.subtle', borderColor: 'fg.muted' }}
                  >
                    <Text fontSize="xl" mb={1}>{item.icon}</Text>
                    <Text textStyle="xs" fontWeight="600" color="fg">{item.label}</Text>
                  </Button>
                ))}
              </Grid>
            </Box>
          </Flex>

          <Box
            borderWidth="thin"
            borderColor="border.subtle"
            borderRadius="2xl"
            p={8}
            bg="bg.panel"
            h="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Heading textStyle="md" fontWeight="700">
                나의 스냅
              </Heading>
              <Button variant="ghost" size="sm" color="fg.muted">
                전체보기 &gt;
              </Button>
            </Flex>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap={4}
              flex="1"
            >
              {['1', '2', '3', '4'].map((num) => (
                <Box
                  key={num}
                  overflow="hidden"
                  borderRadius="xl"
                  borderWidth="thin"
                  borderColor="border.subtle"
                  minH="13rem"
                  h="100%"
                  bg="bg.muted"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text textStyle="sm" fontWeight="semibold" color="fg.muted">스냅 {num}</Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  );
}