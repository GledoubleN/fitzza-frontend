import { Grid, GridItem, IconButton, Stack, Text } from '@chakra-ui/react'
import { LuBell, LuShoppingBag, LuUsers } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

export const AppBar = () => {
  const navigate = useNavigate()

  return (
    <Grid templateColumns={ 'auto 1fr auto' } gap={ '4' }>
      <GridItem alignContent={ 'center' }>
        <Text fontSize="2xl" fontWeight="bold">
          Fitzza
        </Text>
      </GridItem>
      <GridItem></GridItem>
      <GridItem>
        <Stack direction={ 'row' }>
          <IconButton rounded={ 'full' }>
            <LuUsers></LuUsers>
          </IconButton>
          <IconButton rounded={ 'full' }>
            <LuBell></LuBell>
          </IconButton>
          <IconButton rounded={ 'full' } onClick={ () => { navigate('/shopping-cart') } }>
            <LuShoppingBag></LuShoppingBag>
          </IconButton>
        </Stack>
      </GridItem>
    </Grid>
  )
}