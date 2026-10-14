import {
  Container,
  Grid,
  IconButton,
  Stack,
  Card,
  Text,
  Image,
  Box,
  Input,
  Textarea,
} from '@chakra-ui/react'
import {
  LuArrowUp,
  LuHeart,
  LuSparkle,
} from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { ProductItem } from '../components/ProductItem.jsx'

export const MainPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  const onSubmit = () => {
    navigate('/prompt')
  }

  async function loadRecommendedProducts () {
    api.get('/products/recommended', {}).then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setProducts(response.data)
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    loadRecommendedProducts()
  }, [])

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
                  onClick={ () => {
                    setIsLongPrompt((isLongPrompt) => !isLongPrompt)
                  } }
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
              <ProductItem key={ index } product={ product }></ProductItem>
            ))
          }
        </Grid>
      </Container>

      <TabBar></TabBar>

      <Footer></Footer>
    </Stack>
  )
}