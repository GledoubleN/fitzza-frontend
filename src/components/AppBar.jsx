import { Grid, GridItem, IconButton, Stack, Text } from '@chakra-ui/react'
import { LuBell, LuShirt, LuShoppingBag, LuUsers } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

export const AppBar = () => {
  const navigate = useNavigate()

  return (
    <Grid templateColumns={ 'auto 1fr auto' } gap={ '4' }>
      <GridItem alignContent={ 'center' }>
        <Text fontSize="2xl" fontWeight="bold" onClick={() => navigate('/')}>
          Fitzza
        </Text>
      </GridItem>
      <GridItem></GridItem>
      <GridItem>
        <Stack direction={ 'row' } gap={ 2 }>
          <IconButton rounded={ 'full' } onClick={ () => { navigate('/try-on') } }>
            <LuShirt></LuShirt>
          </IconButton>
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