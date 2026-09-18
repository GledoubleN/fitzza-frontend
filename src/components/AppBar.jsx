import { Grid, GridItem, IconButton, Stack, Text } from '@chakra-ui/react'
import { LuBell, LuShoppingBag } from 'react-icons/lu'

export const AppBar = () => {
  return (
    <Grid templateColumns={ 'auto 1fr auto auto' } gap={ '4' }>
      <GridItem alignContent={ 'center' }>
        <Text>Fitzza</Text>
      </GridItem>
      <GridItem></GridItem>
      <GridItem>
        <IconButton rounded={ 'full' }>
          <LuBell></LuBell>
        </IconButton>
      </GridItem>
      <GridItem>
        <IconButton rounded={ 'full' }>
          <LuShoppingBag></LuShoppingBag>
        </IconButton>
      </GridItem>
    </Grid>
  )
}