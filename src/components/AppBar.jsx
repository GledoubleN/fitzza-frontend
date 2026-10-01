import { Container, Grid, GridItem, IconButton, Stack, Text } from '@chakra-ui/react'
import { LuBell, LuShirt, LuShoppingBag, LuUsers } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

export const AppBar = ({ maxWidth = '7xl' }) => {
  const navigate = useNavigate()

  const buttonProps = {
    variant: 'ghost',
    rounded: 'full',
  }

  return (
    <Container maxWidth={ maxWidth }>
      <Grid templateColumns={ 'auto 1fr auto' } gap={ '4' }>
        <GridItem alignContent={ 'center' }>
          <Text fontSize="2xl" fontWeight="bold" onClick={ () => navigate('/') }>
            Fitzza
          </Text>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Stack direction={ 'row' } gap={ 2 }>
            <IconButton { ...buttonProps } onClick={ () => { navigate('/try-on') } }>
              <LuShirt></LuShirt>
            </IconButton>
            <IconButton { ...buttonProps }>
              <LuBell></LuBell>
            </IconButton>
            <IconButton { ...buttonProps } onClick={ () => { navigate('/shopping-cart') } }>
              <LuShoppingBag></LuShoppingBag>
            </IconButton>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  )
}