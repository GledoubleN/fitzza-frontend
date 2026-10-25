import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { Footer } from '../components/Footer.jsx'
import { ProfileSummaryCard } from './ProfileSummaryCard.jsx'
import { ProfileQuickLinks } from './ProfileQuickLinks.jsx'
import { VtonGalleryCard } from './VtonGalleryCard.jsx'

export default function ProfilePage () {
  return (
    <Stack
      gap={ 8 }
      paddingY={ 4 }
      minHeight="100vh"
      bg="bg.subtle"
    >
      <Header/>
      <Container
        as="main"
        maxWidth="7xl"
        paddingX={ { base: 4, md: 8 } }
        flex={ 1 }
      >
        <Stack gap={ 8 }>
          <Stack gap={ 4 }>
            <Text
              textStyle="xs"
              fontWeight="700"
              letterSpacing="widest"
              color="primary.fg"
            >
              MY FITZZA
            </Text>
            <Heading
              as="h1"
              textStyle={ { base: '2xl', md: '3xl' } }
            >
              나의 스타일 공간
            </Heading>
            <Text
              textStyle="sm"
              color="fg.muted"
            >
              내 취향을 정리하고, 나에게 어울렸던 스타일을 다시 만나보세요.
            </Text>
          </Stack>
          <Grid
            templateColumns={ { base: 'minmax(0, 1fr)', lg: 'minmax(0, 5fr) minmax(0, 7fr)' } }
            gap={ 8 }
            alignItems="start"
          >
            <ProfileSummaryCard/>
            <Stack
              gap={ 8 }
              minWidth={ 0 }
            >
              <VtonGalleryCard/>
              <ProfileQuickLinks/>
            </Stack>
          </Grid>
        </Stack>
      </Container>
      <Footer/>
      <TabBar/>
    </Stack>
  )
}