import { Grid, Stack, Text } from '@chakra-ui/react'
import { ProductItem } from '../../components/ProductItem.jsx'

const CATEGORY_NAMES = {
  상의: 'Top',
  하의: 'Bottom',
  아우터: 'Outer',
  신발: 'Shoes',
  모자: 'Cap',
}

const SectionTitle = ({ children }) => (
  <Text
    fontFamily="logo"
    fontWeight="black"
    textStyle="xl"
    textTransform="uppercase"
    borderTopWidth="thick"
    borderBottomWidth="thin"
    borderColor="fg"
    paddingY={ 1 }
  >
    { children }
  </Text>
)

export const ProductGrid = ({ products }) => {
  const productsByCategory = Object.groupBy(products, (product) => product.category)

  return (
    <Stack gap={ 12 }>
      {
        Object.entries(productsByCategory).map(([category, sectionProducts]) => (
          <Stack
            key={ category }
            gap={ 4 }
          >
            <SectionTitle>Today&apos;s Pick - { CATEGORY_NAMES[category] ?? category }</SectionTitle>
            <Grid
              templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
              gap={ 4 }
            >
              {
                sectionProducts.map((product) => (
                  <ProductItem
                    key={ product.productId }
                    product={ product }
                  />
                ))
              }
            </Grid>
          </Stack>
        ))
      }
    </Stack>
  )
}
