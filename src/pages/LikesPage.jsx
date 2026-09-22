import { Container, Grid, GridItem, Stack, Card, Image, Text, IconButton } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import exampleProductImage from '/src/assets/hero.png'
import { LuX } from 'react-icons/lu'

export const LikesPage = () => {
  return (
    <>
    <Container maxWidth="xl">
      <Stack paddingY={ 4 } paddingBottom="96px" height={ '100vh' } gap={ 4 }>
        <AppBar></AppBar>
        <Grid templateColumns={ 'repeat(3, 1fr)' } gap={ 2 }>
          {
            Array.from({ length: 9 }, (_, index) => (
              <Card.Root key={ index }>
                <Image src={ exampleProductImage }></Image>
                <Card.Body>
                  <Card.Title>Name</Card.Title>
                  <Text>{ (1_000).toLocaleString() } 원</Text>
                </Card.Body>
                <IconButton
                  position={ 'absolute' }
                  right={ '2' }
                  top={ '2' }
                  rounded={ 'full' }
                  size={ 'xs' }
                >
                  <LuX></LuX>
                </IconButton>
              </Card.Root>
            ))
          }
        </Grid>
      </Stack>
    </Container>
    <TabBar />
    </>
  )
}