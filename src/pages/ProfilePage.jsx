import { Container, Grid, Stack } from '@chakra-ui/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { Footer } from '../components/Footer.jsx'
import { ProfileSummaryCard } from './ProfileSummaryCard.jsx'
import { VtonGalleryCard } from './VtonGalleryCard.jsx'

export default function ProfilePage () {
  return (
    <Stack
      gap={ 4 }
      paddingY={ 4 }
      minHeight={ '100vh' }
    >
      <Header/>

      <Container
        maxWidth={ '5xl' }
        flex={ 1 }
      >
        <Grid
          templateColumns={ { base: '1fr', lg: '1fr 1.8fr' } }
          gap={ 4 }
          alignItems={ 'start' }
        >
          <ProfileSummaryCard/>

          <VtonGalleryCard/>
        </Grid>
      </Container>

      <TabBar/>
    </Stack>
  )
}