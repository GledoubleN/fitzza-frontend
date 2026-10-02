import {
  Button,
  Container,
  Grid,
  Stack,
  Image,
  GridItem,
  Box,
  IconButton,
  Flex,
  Card,
  Separator,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import exampleResultImage from '/src/assets/hero.png'
import examplePersonImage from '/src/assets/react.svg'
import exampleClothesImage from '/src/assets/vite.svg'
import { Footer } from '../components/Footer.jsx'
import { LuPlus, LuX } from 'react-icons/lu'

export const TryOnPage = () => {
  const getReferenceImages = (direction) => {
    return (
      <Stack
        direction={ direction }
        gap={ 4 }
        separator={ <Separator/> }
        height={ '100%' }
        width={ '100%' }
      >
        <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
          <Image objectFit={ 'cover' } src={ examplePersonImage }></Image>
          <IconButton
            position={ 'absolute' }
            top={ 0 }
            right={ 0 }
            variant={ 'ghost' }
            rounded={ 'full' }
          >
            <LuX></LuX>
          </IconButton>
        </Card.Root>
        <Stack direction={ direction }>
          <Card.Root aspectRatio={ 1 } flexShrink={ 0 }>
            <Flex height={ '100%' } align={ 'center' } justify={ 'center' }>
              <IconButton rounded={ 'full' }>
                <LuPlus></LuPlus>
              </IconButton>
            </Flex>
          </Card.Root>
          {
            Array.from({ length: 5 }, (_, index) => (
              <Card.Root
                justifyContent={ 'center' }
                alignContent={ 'center' }
                aspectRatio={ 1 }
                flexShrink={ 0 }
                key={ index }
              >
                <Image objectFit={ 'cover' } src={ exampleClothesImage }></Image>
                <IconButton
                  position={ 'absolute' }
                  top={ 0 }
                  right={ 0 }
                  variant={ 'ghost' }
                  rounded={ 'full' }
                >
                  <LuX></LuX>
                </IconButton>
              </Card.Root>
            ))
          }
        </Stack>
      </Stack>
    )
  }

  return (
    <Grid
      templateRows={ 'auto minmax(0, 1fr) auto' }
      paddingY={ 4 }
      height={ '100vh' }
      gap={ 4 }
    >
      <AppBar></AppBar>
      <Container maxWidth={ '3xl' }>
        <Grid
          templateColumns={ { base: '1fr', md: '3fr 1fr' } }
          height={ '100%' }
          gap={ 4 }
        >
          <Grid
            templateRows={ { base: '3fr 1fr auto', md: '1fr auto' } }
            gap={ 4 }
          >
            <GridItem justifyItems={ 'center' } alignContent={ 'center' }>
              <Image src={ exampleResultImage }></Image>
            </GridItem>
            <GridItem
              display={ { md: 'none' } }
              overflowX="auto"
              flexWrap="nowrap"
            >
              {
                getReferenceImages('row')
              }
            </GridItem>
            <Button width={ '100%' }>입어보기</Button>
          </Grid>
          <Flex
            display={ { base: 'none', sm: 'flex' } }
            direction={ 'column' }
            overflowY="auto"
            flexWrap="nowrap"
          >
            {
              getReferenceImages('column')
            }
          </Flex>
        </Grid>
      </Container>
      <Footer></Footer>
    </Grid>
  )
}