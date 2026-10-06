import { Button, Container, Flex, Stack, Card, Text, Image, IconButton, Box, Grid, GridItem } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { products } from '../data/products.js'
import exampleProductImage from '/src/assets/react.svg'
import { LuX } from 'react-icons/lu'

export const ShoppingCartPage = () => {
  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="7xl" mx="auto" px={5}>
        <Stack gap={6}>
          <Text textStyle="lg" fontWeight="bold">
            장바구니
          </Text>

          <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} alignItems="start">

            <Stack gap={4}>
              {
                products.slice(0, 3).map((product, index) => {
                  return (
                    <Card.Root key={index} variant="subtle" borderWidth="thin" borderColor="border.subtle" bg="bg.panel" position="relative">
                      <Card.Body>
                        <Grid
                          templateColumns="5rem 1fr auto"
                          templateAreas={`"image info action"`}
                          gap={4}
                          alignItems="center"
                        >
                          <Box gridArea="image">
                            <Image boxSize="20" objectFit="cover" rounded="xl" src={exampleProductImage} />
                          </Box>

                          <Stack gridArea="info" gap={1}>
                            <Text textStyle="sm" fontWeight="semibold">{product.name}</Text>
                            <Text textStyle="xs" color="fg.muted">{product.price.toLocaleString()} 원</Text>
                          </Stack>

                          <Box gridArea="action" justifySelf="end">
                            <IconButton
                              aria-label="삭제"
                              rounded="full"
                              variant="ghost"
                              size="xs"
                            >
                              <Box as={LuX} boxSize={4} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Card.Body>
                    </Card.Root>
                  )
                })
              }
            </Stack>

            <Stack gap={6}>
              <Card.Root borderWidth="thin" borderColor="border.subtle" bg="bg.panel" borderRadius="2xl" p={6}>
                <Card.Body p={0} gap={4}>
                  <Text fontWeight="bold" textStyle="sm">결제 정보</Text>
                  <Flex justify="space-between" align="center">
                    <Text textStyle="sm" color="fg.muted">총 주문금액</Text>
                    <Text textStyle="lg" fontWeight="bold">{(10_000).toLocaleString()} 원</Text>
                  </Flex>
                </Card.Body>
              </Card.Root>

              <Button size="lg" width="full" borderRadius="xl">
                주문하기
              </Button>
            </Stack>

          </Grid>
        </Stack>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  )
}