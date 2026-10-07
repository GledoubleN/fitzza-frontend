import {
  Button,
  Container,
  Flex,
  Stack,
  Card,
  Text,
  Image,
  IconButton,
  Box,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { products } from '../data/products.js'
import exampleProductImage from '/src/assets/react.svg'
import { LuX } from 'react-icons/lu'
import { Footer } from '../components/Footer.jsx'

export const ShoppingCartPage = () => {
  return (
    <Grid
      templateRows={ 'auto auto 1fr auto' }
      minHeight="100vh"
      paddingY={ 4 }
      gap={ 4 }
      bg="bg"
    >
      <AppBar/>

      <Container maxWidth={ '7xl' }>
        <Heading>
          장바구니
        </Heading>
      </Container>

      <Container maxW={ '5xl' }>
        <Stack gap={ 4 }>
          <Grid templateColumns={ { base: '1fr', lg: '3fr 2fr' } } gap={ 4 } alignItems="start">
            <Stack gap={ 4 }>
              { products.map((product, index) => {
                return (
                  <Card.Root
                    key={ index }
                    bg="bg.panel"
                    position="relative"
                  >
                    <Card.Body>
                      <Grid
                        templateColumns={ 'auto 1fr auto' }
                        templateAreas={ `"image info action"` }
                        gap={ 4 }
                        alignItems="center"
                      >
                        <Box gridArea="image">
                          <Image
                            boxSize="20"
                            objectFit="contain"
                            rounded="xl"
                            src={ exampleProductImage }
                          />
                        </Box>

                        <Stack gridArea="info" gap={ 4 }>
                          <Text textStyle="sm" fontWeight="semibold">{ product.name }</Text>
                          <Text textStyle="xs" color="fg.muted">{ product.price.toLocaleString() } 원</Text>
                        </Stack>

                        <Box gridArea="action" justifySelf="end">
                          <IconButton
                            aria-label="삭제"
                            rounded="full"
                            variant="ghost"
                            size="xs"
                          >
                            <LuX></LuX>
                          </IconButton>
                        </Box>
                      </Grid>
                    </Card.Body>
                  </Card.Root>
                )
              }) }
            </Stack>

            <Stack
              gap={ 4 }
              position={ 'sticky' }
              top={ 4 }
              bottom={ 4 }
              alignSelf="start"
            >
              <Card.Root>
                <Card.Body>
                  <Stack>
                    <Text fontWeight="bold" textStyle="sm">결제 정보</Text>
                    <Flex justify="space-between" align="center">
                      <Text textStyle="sm" color="fg.muted">총 주문금액</Text>
                      <Text textStyle="lg" fontWeight="bold">{ (10_000).toLocaleString() } 원</Text>
                    </Flex>
                  </Stack>
                </Card.Body>
              </Card.Root>

              <Button size="lg" width="full">
                주문하기
              </Button>
            </Stack>
          </Grid>
        </Stack>
      </Container>

      <Footer></Footer>
    </Grid>
  )
}