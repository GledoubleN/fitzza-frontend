import {
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Card,
  Text,
  GridItem,
  Image,
  Carousel,
  Box, Center, InputGroup, Input, Switch,
} from '@chakra-ui/react'
import { LuBell, LuChevronLeft, LuChevronRight, LuHeart, LuSearch, LuShoppingBag } from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'
import exampleBannerImage from '/src/assets/vite.svg'
import { products } from '/src/data/products.js'
import { banners } from '/src/data/banners.js'
import { HiCheck, HiX } from 'react-icons/hi'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'

export const MainPage = () => {
  const navigate = useNavigate()

  const onSubmit = () => {
    navigate('/prompt')
  }

  return (
    <>
    <Container maxWidth={ 'xl' } height="100vh" paddingY={ '4' } paddingBottom="96px">
      <Stack direction={ 'column' } gap={ '4' }>
        <AppBar></AppBar>

        <Stack direction={ 'row' }>
          <Switch.Root>
            <Switch.HiddenInput/>
            <Switch.Control>
              <Switch.Thumb>
                <Switch.ThumbIndicator fallback={ <HiX color="black"/> }>
                  <HiCheck/>
                </Switch.ThumbIndicator>
              </Switch.Thumb>
            </Switch.Control>
            <Switch.Label/>
          </Switch.Root>
          <InputGroup onClick={ onSubmit } startElement={ <LuSearch></LuSearch> }>
            <Input></Input>
          </InputGroup>
        </Stack>

        <Carousel.Root slideCount={ banners.length }>
          <Carousel.ItemGroup height={ '100px' }>
            {
              banners.map((_, index) => (
                <Carousel.Item key={ index } index={ index } alignContent={ 'center' }>
                  <Center height={ '100%' }>
                    <Image height={ '100%' } src={ exampleBannerImage }></Image>
                  </Center>
                </Carousel.Item>
              ))
            }
          </Carousel.ItemGroup>
          <Carousel.Control justifyContent="center" gap="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronLeft/>
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.Indicators/>

            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronRight/>
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>
        </Carousel.Root>

        <Grid templateColumns={ 'repeat(3, 1fr)' } gap={ '4' }>
          {
            products.map((product, index) => {
              return (
                <GridItem>
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
      </Stack>
    </Container>
    <TabBar />
    </>
  )
}