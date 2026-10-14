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
import exampleProductImage from '/src/assets/hero.png'
import { LuHeart, LuX } from 'react-icons/lu'

export const WishlistPage = () => {
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
            Array.from({ length: 50 }, (_, index) => (
              <Card.Root key={ index } borderWidth={ 0 }>
                <Image src={ exampleProductImage }></Image>
                <Card.Body padding={ '2' }>
                  <Card.Title>Name</Card.Title>
                  <Text truncate>{ (1_000).toLocaleString() } 원</Text>
                </Card.Body>
                <IconButton
                  variant={ 'ghost' }
                  position={ 'absolute' }
                  right={ 0 }
                  top={ 0 }
                  rounded={ 'full' }
                  size={ 'md' }
                >
                  <LuHeart></LuHeart>
                </IconButton>
              </Card.Root>
            ))
          }
        </Grid>
      </Container>
      <TabBar/>
    </Stack>
  )
}