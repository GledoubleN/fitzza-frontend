import {
  Container,
  Grid,
  Stack,
  Card,
} from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { ProductItem } from '../components/ProductItem.jsx'
import { SignInRequiredDialog } from '../components/SignInRequiredDialog.jsx'
import { useAuth } from '../contexts/AuthContext.js'
import { MainPromptForm } from './MainPromptForm.jsx'

export const MainPage = () => {
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

  useEffect(() => {
    let cancelled = false
    const endpoint = isSignedIn ? '/recommendations/personalized' : '/products'
    setProducts([])

    api.get(endpoint)
      .then(({ data }) => {
        if (!cancelled) setProducts(data.content ?? [])
      })
      .catch((error) => {
        if (!cancelled) console.log(error)
      })

    return () => { cancelled = true }
  }, [isSignedIn])

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
              <MainPromptForm onSubmitQuery={ onSubmitQuery }/>
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