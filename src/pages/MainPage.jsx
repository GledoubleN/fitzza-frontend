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
  Box, Center, InputGroup, Input, Switch, Textarea, Marquee,
} from '@chakra-ui/react'
import {
  LuArrowUp,
  LuBell,
  LuBot,
  LuBotOff, LuCamera,
  LuChevronLeft,
  LuChevronRight,
  LuHeart, LuPlus,
  LuSearch,
  LuShoppingBag, LuSparkle,
} from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'
import exampleBannerImage from '/src/assets/vite.svg'
import { products } from '/src/data/products.js'
import { banners } from '/src/data/banners.js'
import { HiCheck, HiX } from 'react-icons/hi'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'
import { IoLogoFigma, IoLogoGitlab } from 'react-icons/io5'
import { IoLogoJavascript, IoLogoLinkedin, IoLogoTwitter, IoLogoVimeo } from 'react-icons/io'
import { Footer } from '../components/Footer.jsx'
import { useRef, useState } from 'react'

export const MainPage = () => {
  const navigate = useNavigate()

  const onSubmit = () => {
    navigate('/prompt')
  }

  const [isLongPrompt, setIsLongPrompt] = useState(false)

  return (
    <Stack
      gap={ 4 }
      paddingY={ '4' }
      minHeight={ '100vh' }
    >
      <AppBar></AppBar>

      <Container maxWidth={ '3xl' }>
        <Card.Root
          height={ '100%' }
          rounded={ '3xl' }
        >
          <Card.Body padding={ 2 }>
            <Stack height={ '100%' } gap={ 2 } position="relative">
              <Grid templateColumns={ 'auto 1fr auto' } gap={ 2 }>
                <IconButton
                  rounded={ 'full' }
                  onClick={ () => { setIsLongPrompt((isLongPrompt) => !isLongPrompt) } }
                >
                  <LuSparkle/>
                </IconButton>
                <Input variant={ 'none' }></Input>
                <IconButton rounded={ 'full' }>
                  <LuArrowUp/>
                </IconButton>
              </Grid>
              {
                isLongPrompt &&
                <Textarea
                  resize={ 'none' }
                  variant={ 'none' }
                  padding={ 4 }
                  rows={ 3 }
                ></Textarea>
              }
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>

      <Container maxWidth={ '5xl' }>
        <Grid templateColumns={ 'repeat(3, 1fr)' } gap={ 4 }>
          {
            products.map((product, index) => (
              <Stack gap={ 4 }>
                <Box position={ 'relative' }>
                  <Image src={ exampleProductImage }></Image>
                  <IconButton
                    position={ 'absolute' }
                    bottom={ 0 }
                    right={ 0 }
                    variant={ 'ghost' }
                    rounded={ 'full' }
                  >
                    <LuHeart></LuHeart>
                  </IconButton>
                </Box>
                <Stack gap={ 0 }>
                  <Text>{ product.brand }</Text>
                  <Text>{ product.price.toLocaleString() }원</Text>
                </Stack>
              </Stack>
            ))
          }
        </Grid>
      </Container>

      <Footer></Footer>

      <TabBar></TabBar>
    </Stack>
  )
}