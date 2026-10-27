import {
  Container,
  Grid,
  Marquee,
  Stack,
  Card,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Header } from '../../components/Header.jsx'
import { PromptForm } from '../PromptForm.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { Footer } from '../../components/Footer.jsx'
import { SignInRequiredDialog } from '../../components/SignInRequiredDialog.jsx'
import { ProductItem } from '../../components/ProductItem.jsx'
import { api } from '../../api/axios.js'
import { useAuth } from '../../contexts/AuthContext.js'
import { useNavigate } from 'react-router-dom'
import { HttpStatusCode } from 'axios'

export const AIStylistPage = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const [products, setProducts] = useState([])
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  const onSubmitQuery = (query) => {
    if (!isSignedIn) {
      setIsSignInDialogOpen(true)
      return
    }
    navigate('/ai-stylist', { state: { query } })
  }

  async function loadRecommendedProducts () {
    api.get('/products', {}).then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setProducts(response.data.content)
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    loadRecommendedProducts()
  }, [])

  return (
    <Stack
      gap={ 4 }
      paddingY={ 4 }
      minHeight="dvh"
    >
      <Header></Header>

      <Grid
        as="main"
        flex={ 1 }
        templateRows="minmax(0, 1fr) auto minmax(min-content, 1fr)"
        paddingY={ 4 }
        minWidth={ 0 }
      >
        <Container maxWidth="3xl" gridRow={ 2 }>
          <Card.Root rounded="4xl">
            <Card.Body padding={ 4 }>
              <PromptForm onSubmitQuery={ onSubmitQuery }/>
            </Card.Body>
          </Card.Root>
        </Container>

        { products.length > 0 && (
          <Container
            maxWidth="3xl"
            minWidth={ 0 }
            gridRow={ 3 }
            alignSelf="start"
            paddingTop={ 4 }
          >
            <Marquee.Root autoFill pauseOnInteraction speed={ 30 } aria-label="추천 상품">
              <Marquee.Viewport>
                <Marquee.Content>
                  { products.map((product) => (
                    <Marquee.Item
                      key={ product.productId }
                      width={ { base: 28, md: 32 } }
                      flexShrink={ 0 }
                      paddingX={ 4 }
                    >
                      <ProductItem product={ product }/>
                    </Marquee.Item>
                  )) }
                </Marquee.Content>
              </Marquee.Viewport>
            </Marquee.Root>
          </Container>
        ) }
      </Grid>

      <TabBar></TabBar>

      <Footer></Footer>

      <SignInRequiredDialog open={ isSignInDialogOpen } onClose={ () => setIsSignInDialogOpen(false) }/>

    </Stack>
  )
}