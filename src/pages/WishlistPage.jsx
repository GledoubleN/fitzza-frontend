import {
  Container,
  Grid,
  GridItem,
  Stack,
  Card,
  Image,
  Text,
  IconButton,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { ProductItem } from '../components/ProductItem.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'

export const WishlistPage = () => {
  const [products, setProducts] = useState([])

  async function loadWishlist () {
    api.get('/wishlists', {}).then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setProducts(response.data.content)
    }).catch((error) => {

    })
  }

  useEffect(() => {
    loadWishlist()
  })

  return (
    <Stack paddingY={ 4 } height={ '100vh' } gap={ 4 }>
      <AppBar></AppBar>
      <Container maxWidth="5xl">
        {/* gap={ 4 } 이기 때문에 spacing.4를 사용해야 한다. */ }
        <Grid
          templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
          gapX={ 4 }
          gapY={ 8 }
        >
          {
            products.map((product, index) => (
              <ProductItem key={ index } product={ product }></ProductItem>
            ))
          }
        </Grid>
      </Container>
      <TabBar/>
    </Stack>
  )
}