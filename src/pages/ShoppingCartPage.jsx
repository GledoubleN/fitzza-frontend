import { Button, Grid, Stack, Card, Text, Image, IconButton, Box } from '@chakra-ui/react'
import { PageLayout } from '../components/PageLayout.jsx'
import { AppBar } from '../components/AppBar.jsx'
import { products } from '../data/products.js'
import exampleProductImage from '/src/assets/react.svg'
import { LuArrowLeft, LuBrackets, LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu'

export const ShoppingCartPage = () => {
  return (
    <PageLayout>
      <Stack height={ '100%' } gap={ '4' }>
        <AppBar></AppBar>
        {
          products.slice(0, 3).map((product, index) => {
            return (
              <Card.Root key={ index }>
                <Card.Body>
                  <Stack direction={ 'row' }>
                    <Image width={ '100px' } src={ exampleProductImage }></Image>
                    <Stack direction={ 'column' }>
                      <Text>{ product.name }</Text>
                      <Text>{ product.price.toLocaleString() } 원</Text>
                    </Stack>
                    <IconButton
                      position="absolute"
                      top="2"
                      right="2"
                      aria-label="Close"
                      rounded="full"
                      size="xs"
                    >
                      <LuX></LuX>
                    </IconButton>
                  </Stack>
                </Card.Body>
              </Card.Root>
            )
          })
        }
        <Box>
          <Text>총 주문금액 { (10_000).toLocaleString() } 원</Text>
        </Box>
        <Button>주문하기</Button>
      </Stack>
    </PageLayout>
  )

}