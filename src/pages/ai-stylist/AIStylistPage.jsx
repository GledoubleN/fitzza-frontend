import {
  Container,
  Grid,
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
    <Grid
      gap={ 4 }
      templateRows={'auto auto 1fr auto auto'}
      paddingY={ '4' }
      minHeight={ '100vh' }
    >
      <Header></Header>

      <Container maxWidth={ '5xl' }>
        <Card.Root
          height={ '100%' }
          rounded={ '4xl' }
        >
          <Card.Body padding={ 2 }>
            <Stack height={ '100%' } gap={ 2 } position="relative">
              <PromptForm onSubmitQuery={ onSubmitQuery }/>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>

      <Container maxWidth={ '5xl' }>
        <Grid
          templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
          gap={ 4 }
        >
          {
            products.map((product) => (
              <ProductItem
                key={ product.productId }
                product={ product }
              />
            ))
          }
        </Grid>
      </Container>

      <TabBar></TabBar>

      <Footer></Footer>

      <SignInRequiredDialog open={ isSignInDialogOpen } onClose={ () => setIsSignInDialogOpen(false) }/>

    </Grid>
  )
}