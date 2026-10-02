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
  return (
    <Grid templateRows={ 'auto 1fr auto auto' } paddingY={ 4 } height={ '100vh' } gap={ 4 }>
      <AppBar></AppBar>
      <Container maxWidth={ '3xl' }>
        <Grid templateRows={ '3fr 1fr auto' } height={ '100%' } gap={ 4 }>
          <GridItem justifyItems={ 'center' } alignContent={ 'center' }>
            <Image src={ exampleResultImage }></Image>
          </GridItem>
          <Stack
            direction={ 'row' }
            gap={ 4 }
            overflowX="auto"
            flexWrap="nowrap"
            separator={ <Separator/> }
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
            <Stack direction={ 'row' }>
              <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
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
              <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
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
              <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
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
              <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
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
              <Card.Root justifyContent={ 'center' } alignContent={ 'center' } aspectRatio={ 1 } flexShrink={ 0 }>
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
              <Card.Root aspectRatio={ 1 } flexShrink={ 0 }>
                <Flex height={ '100%' } align={ 'center' } justify={ 'center' }>
                  <IconButton rounded={ 'full' }>
                    <LuPlus></LuPlus>
                  </IconButton>
                </Flex>
              </Card.Root>
            </Stack>
          </Stack>
          <Button width={ '100%' }>입어보기</Button>
        </Grid>
      </Container>
      <Footer></Footer>
    </Grid>
  )
}