import { Grid } from '@chakra-ui/react'
import { ProductItem } from '../../components/ProductItem.jsx'

export const ProductGrid = ({ products }) => (
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
)
