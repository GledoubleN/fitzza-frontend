import { Container, Grid, GridItem, Stack, Card, Image, Text, IconButton } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import exampleProductImage from '/src/assets/hero.png'
import { LuX } from 'react-icons/lu'

// 기존에 패딩 없이 했을 경우, 5자리숫자부터 표기가 안되어 Padding을 2로 임의 지정했습니다.
// 현재 6자리숫자(십만단위)까지 문제없이 표기 되며, fontSize를 지정해서 sm으로 만들경우 8자리까지 표현 가능합니다.
export const LikesPage = () => {
  return (
    <>
    <Stack paddingY={ 4 } paddingBottom="96px" height={ '100vh' } gap={ 4 }>
      <Container maxWidth="3xl">
        <AppBar></AppBar>
      </Container>
      <Container maxWidth="3xl">
        <Grid templateColumns={ 'repeat(auto-fill, minmax(100px, 1fr))' } gap={ 2 }>
          {
            Array.from({ length: 50 }, (_, index) => (
              <Card.Root key={ index }>
                <Image src={ exampleProductImage }></Image>
                <Card.Body padding = { '2' }>
                  <Card.Title>Name</Card.Title>
                  <Text truncate>{ (1_000).toLocaleString() } 원</Text>
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
      </Container>
    </Stack>
    <TabBar />
    </>
  )
}