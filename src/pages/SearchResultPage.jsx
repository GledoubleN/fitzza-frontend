import { Card, Grid, GridItem, IconButton, Image, Input, InputGroup, Text } from '@chakra-ui/react'
import { PageLayout } from '../components/PageLayout.jsx'
import { AppBar } from '../components/AppBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import { products } from '../data/products.js'
import exampleProductImage from '../assets/hero.png'
import { useNavigate } from 'react-router-dom'

export const SearchResultPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Grid gap={ '4' }>
        <GridItem>
          <AppBar></AppBar>
        </GridItem>
        <GridItem>
          <InputGroup startElement={ <LuSearch></LuSearch> }>
            <Input></Input>
          </InputGroup>
        </GridItem>
        <GridItem>
          <Grid templateColumns={ { base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' } } gap={ '4' }>
            {
              products.map((product, index) => {
                return (
                  <GridItem key={ index }>
                    <Card.Root onClick={() => navigate('/products/1')}>
                      <IconButton
                        position="absolute"
                        top="2"
                        right="2"
                        aria-label="Close"
                        rounded="full"
                        size="xs"
                      >
                        <LuHeart></LuHeart>
                      </IconButton>
                      <Image src={ exampleProductImage }></Image>
                      <Card.Body padding={ '2' }>
                        <Text>{ product.name }</Text>
                        <Text>{ product.price.toLocaleString() } 원</Text>
                      </Card.Body>
                    </Card.Root>
                  </GridItem>
                )
              })
            }
          </Grid>
        </GridItem>
      </Grid>
    </PageLayout>
  )
}