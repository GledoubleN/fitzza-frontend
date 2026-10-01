import { Box, Container, Grid, GridItem, IconButton, Popover, Portal, Separator, Stack, Text } from '@chakra-ui/react'
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
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton { ...buttonProps }>
                  <LuBell></LuBell>
                </IconButton>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content width="sm">
                    <Popover.Arrow />
                    <Popover.Body>
                      <Stack separator={<Separator />}>
                        <Box>Notification 1</Box>
                        <Box>Notification 2</Box>
                        <Box>Notification 3</Box>
                      </Stack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
            <IconButton { ...buttonProps } onClick={ () => { navigate('/shopping-cart') } }>
              <LuShoppingBag></LuShoppingBag>
            </IconButton>
          </Stack>
        </GridItem>
      </Grid>
      <Portal>

      </Portal>
    </Container>
  )
}